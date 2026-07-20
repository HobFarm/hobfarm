import rawManifest from "./workshop-process-film.json";

export type WorkshopProcessVariant = "vertical" | "wide";
export type WorkshopProcessMediaRole = "reference" | "main" | "overlay" | "video";

export type WorkshopProcessMedia = {
  role: WorkshopProcessMediaRole;
  src: string;
  alt?: string;
  crop?: string;
};

export type WorkshopProcessStage = {
  id: string;
  order: number;
  timing: Record<WorkshopProcessVariant, { start: number; duration: number }>;
  label: string;
  headline: string;
  explanation: string;
  shotDirection: string;
  media: WorkshopProcessMedia[];
  locked?: string[];
  variable?: string[];
};

export type WorkshopProcessManifest = {
  id: string;
  version: number;
  title: string;
  summary: string;
  endMessage: string;
  variants: Record<
    WorkshopProcessVariant,
    {
      width: number;
      height: number;
      duration: number;
      videoSrc: string;
      posterSrc: string;
      label: string;
    }
  >;
  stages: WorkshopProcessStage[];
};

export const workshopProcessFilm = rawManifest as WorkshopProcessManifest;

export function getStageMedia(
  stage: WorkshopProcessStage,
  role: WorkshopProcessMediaRole,
): WorkshopProcessMedia | undefined {
  return stage.media.find((item) => item.role === role);
}

export function getStageAtTime(
  time: number,
  variant: WorkshopProcessVariant,
  manifest: WorkshopProcessManifest = workshopProcessFilm,
): WorkshopProcessStage {
  return (
    [...manifest.stages]
      .reverse()
      .find((stage) => time >= stage.timing[variant].start) ?? manifest.stages[0]
  );
}
