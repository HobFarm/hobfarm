const PRINTFUL_API_ORIGIN = "https://api.printful.com";
const MAX_PAGES = 20;
const PAGE_SIZE = 100;

function normalize(value) {
  return String(value ?? "").trim().toLocaleLowerCase("en-US");
}

function safeProviderError(status) {
  return {
    status,
    code:
      status === 401
        ? "printful_unauthorized"
        : status === 403
          ? "printful_scope_denied"
          : status === 429
            ? "printful_rate_limited"
            : "printful_request_failed",
  };
}

async function requestJson(fetchImpl, token, pathname, storeId) {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    "User-Agent": "HobFarm-Commerce-Inspector/1.0",
  };
  if (storeId !== undefined) {
    headers["X-PF-Store-Id"] = String(storeId);
  }

  const response = await fetchImpl(`${PRINTFUL_API_ORIGIN}${pathname}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw Object.assign(
      new Error(`Printful request failed with status ${response.status}`),
      safeProviderError(response.status),
    );
  }

  return response.json();
}

async function postJson(fetchImpl, token, pathname, storeId, body) {
  const response = await fetchImpl(`${PRINTFUL_API_ORIGIN}${pathname}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "HobFarm-Commerce-Inspector/1.0",
      "X-PF-Store-Id": String(storeId),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw Object.assign(
      new Error(`Printful request failed with status ${response.status}`),
      safeProviderError(response.status),
    );
  }

  return response.json();
}

async function getAllV1Items(fetchImpl, token, pathname, selectItems, storeId) {
  const collected = [];

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const offset = page * PAGE_SIZE;
    const separator = pathname.includes("?") ? "&" : "?";
    const payload = await requestJson(
      fetchImpl,
      token,
      `${pathname}${separator}limit=${PAGE_SIZE}&offset=${offset}`,
      storeId,
    );
    const items = selectItems(payload);
    collected.push(...items);

    const total = Number(payload?.paging?.total ?? collected.length);
    if (items.length < PAGE_SIZE || collected.length >= total) {
      return collected;
    }
  }

  throw new Error("Printful pagination exceeded the inspection limit");
}

function sanitizeTemplate(template) {
  return {
    id: template.id,
    title: template.title,
    catalogProductId: template.product_id,
    externalProductId: template.external_product_id ?? null,
    availableVariantIds: Array.isArray(template.available_variant_ids)
      ? template.available_variant_ids
      : [],
    colors: Array.isArray(template.colors)
      ? template.colors.map((color) => color?.color_name).filter(Boolean)
      : [],
    sizes: Array.isArray(template.sizes) ? template.sizes : [],
    placements: Array.isArray(template.placements) ? template.placements : [],
    mockupFileUrl: template.mockup_file_url ?? null,
  };
}

function sanitizeSyncProduct(product, store) {
  return {
    store: {
      id: store.id,
      name: store.name,
      type: store.type,
    },
    id: product.id,
    externalId: product.external_id ?? null,
    name: product.name,
    variantCount: product.variants,
    syncedVariantCount: product.synced,
    thumbnailUrl: product.thumbnail_url ?? null,
    ignored: Boolean(product.is_ignored),
  };
}

function sanitizeSyncVariant(variant) {
  return {
    id: variant.id,
    externalId: variant.external_id ?? null,
    catalogVariantId: variant.variant_id,
    name: variant.name,
    synced: Boolean(variant.synced),
    retailPrice: variant.retail_price ?? null,
    currency: variant.currency ?? null,
    sku: variant.sku ?? null,
    availabilityStatus: variant.availability_status ?? null,
    files: Array.isArray(variant.files)
      ? variant.files.map((file) => ({
          id: file.id,
          type: file.type,
          filename: file.filename ?? null,
          sourceUrl: file.url ?? null,
          previewUrl: file.preview_url ?? null,
          visible: file.visible !== false,
        }))
      : [],
    options: Array.isArray(variant.options) ? variant.options : [],
  };
}

async function getSyncProductDetail(fetchImpl, token, store, product) {
  const payload = await requestJson(
    fetchImpl,
    token,
    `/store/products/${encodeURIComponent(product.id)}`,
    store.id,
  );
  const result = payload?.result ?? {};
  return {
    ...sanitizeSyncProduct(result.sync_product ?? product, store),
    variants: Array.isArray(result.sync_variants)
      ? result.sync_variants.map(sanitizeSyncVariant)
      : [],
  };
}

export async function inspectPrintfulProduct({
  token,
  targetTitle,
  targetStoreName,
  fetchImpl = fetch,
}) {
  if (typeof token !== "string" || token.length < 10) {
    throw new TypeError("A Printful token is required");
  }

  const storePayload = await requestJson(
    fetchImpl,
    token,
    `/v2/stores?limit=${PAGE_SIZE}`,
  );
  const stores = Array.isArray(storePayload?.data) ? storePayload.data : [];
  const targetStores = stores.filter(
    (store) => normalize(store.name) === normalize(targetStoreName),
  );

  let templateMatches = [];
  let templateError = null;
  try {
    const templates = await getAllV1Items(
      fetchImpl,
      token,
      "/product-templates",
      (payload) => (Array.isArray(payload?.result?.items) ? payload.result.items : []),
    );
    templateMatches = templates
      .filter((template) => normalize(template.title) === normalize(targetTitle))
      .map(sanitizeTemplate);
  } catch (error) {
    templateError = {
      status: Number(error?.status ?? 0) || null,
      code: error?.code ?? "printful_template_read_failed",
    };
  }

  const syncProductMatches = [];
  const storeErrors = [];

  for (const store of targetStores) {
    try {
      const products = await getAllV1Items(
        fetchImpl,
        token,
        "/store/products",
        (payload) => (Array.isArray(payload?.result) ? payload.result : []),
        store.id,
      );
      const matches = products.filter(
        (product) => normalize(product.name) === normalize(targetTitle),
      );
      for (const product of matches) {
        syncProductMatches.push(
          await getSyncProductDetail(fetchImpl, token, store, product),
        );
      }
    } catch (error) {
      storeErrors.push({
        storeId: store.id,
        storeName: store.name,
        status: Number(error?.status ?? 0) || null,
        code: error?.code ?? "printful_store_read_failed",
      });
    }
  }

  const state =
    syncProductMatches.length > 0
      ? "store_product"
      : templateMatches.length > 0
        ? "template_only"
        : templateError || storeErrors.length > 0
          ? "inspection_incomplete"
          : "not_found";

  return {
    target: {
      title: targetTitle,
      storeName: targetStoreName,
    },
    state,
    targetStores: targetStores.map((store) => ({
      id: store.id,
      name: store.name,
      type: store.type,
    })),
    templateMatches,
    templateError,
    syncProductMatches,
    storeErrors,
    checkedAt: new Date().toISOString(),
  };
}

function sanitizeShippingRate(rate) {
  return {
    shipping: rate.shipping,
    name: rate.shipping_method_name,
    rate: rate.rate,
    currency: rate.currency,
    minDeliveryDays: rate.min_delivery_days ?? null,
    maxDeliveryDays: rate.max_delivery_days ?? null,
    minDeliveryDate: rate.min_delivery_date ?? null,
    maxDeliveryDate: rate.max_delivery_date ?? null,
    shipmentCount: Array.isArray(rate.shipments) ? rate.shipments.length : 0,
    departureCountries: Array.isArray(rate.shipments)
      ? [...new Set(rate.shipments.map((shipment) => shipment.departure_country).filter(Boolean))]
      : [],
    customsFeesPossible: Array.isArray(rate.shipments)
      ? rate.shipments.some((shipment) => shipment.customs_fees_possible)
      : false,
  };
}

export async function inspectPrintfulShipping({
  token,
  storeId,
  destination,
  scenarios,
  fetchImpl = fetch,
}) {
  const results = [];
  for (const scenario of scenarios) {
    const payload = await postJson(
      fetchImpl,
      token,
      "/v2/shipping-rates",
      storeId,
      {
        recipient: destination,
        order_items: scenario.items.map((item) => ({
          source: "catalog",
          catalog_variant_id: item.catalogVariantId,
          quantity: item.quantity,
        })),
        currency: "USD",
      },
    );
    results.push({
      code: scenario.code,
      items: scenario.items,
      rates: Array.isArray(payload?.data)
        ? payload.data.map(sanitizeShippingRate)
        : [],
    });
  }

  return {
    destination: {
      countryCode: destination.country_code,
      stateCode: destination.state_code ?? null,
      zip: destination.zip ?? null,
    },
    scenarios: results,
    checkedAt: new Date().toISOString(),
  };
}

export async function inspectPrintfulFile({
  token,
  fileId,
  storeId,
  fetchImpl = fetch,
}) {
  const payload = await requestJson(
    fetchImpl,
    token,
    `/files/${encodeURIComponent(fileId)}`,
    storeId,
  );
  const file = payload?.result ?? {};
  return {
    id: file.id ?? null,
    type: file.type ?? null,
    filename: file.filename ?? null,
    sourceUrl: file.url ?? null,
    previewUrl: file.preview_url ?? null,
    status: file.status ?? null,
    visible: file.visible !== false,
    width: file.width ?? null,
    height: file.height ?? null,
    dpi: file.dpi ?? null,
  };
}

export async function inspectPrintfulCatalogVariant({
  token,
  variantId,
  storeId,
  fetchImpl = fetch,
}) {
  const payload = await requestJson(
    fetchImpl,
    token,
    `/v2/catalog-variants/${encodeURIComponent(variantId)}`,
    storeId,
  );
  return payload?.data ?? null;
}

export async function inspectPrintfulCatalogProduct({
  token,
  productId,
  storeId,
  fetchImpl = fetch,
}) {
  const payload = await requestJson(
    fetchImpl,
    token,
    `/v2/catalog-products/${encodeURIComponent(productId)}`,
    storeId,
  );
  return payload?.data ?? null;
}
