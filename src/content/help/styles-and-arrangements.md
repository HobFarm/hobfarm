---
title: "Styles and Arrangements"
description: "How to use style anchors and arrangements to steer your creative direction."
project: "stylefusion"
section: "styles"
order: 1
publishedAt: 2026-03-13
---

## Style Anchors

Style anchors are tag chips in the IR viewer that define the core aesthetic direction. They sit between the arrangement dropdown and the IR sections, and they directly influence how prompts get compiled.

Think of them as the high-level creative brief: "gothic," "watercolor," "cyberpunk," "art nouveau." They tell the compilation step what overall aesthetic to aim for, separate from the detailed visual DNA below.

**Adding anchors:** click the add button and type a style term. Be as specific or general as you want. "Dark fantasy" works. So does "Berserk manga ink wash."

**Removing anchors:** click the X on any chip to remove it.

**Reordering:** drag chips to reorder. Order matters; earlier anchors carry more weight in compilation.

Style anchors combine with (not replace) the visual DNA extracted from your reference. If your reference has warm earth tones but your style anchor says "cyberpunk," the compiled prompt will try to reconcile both: the warm palette with cyberpunk rendering conventions. Sometimes that tension produces interesting results. Sometimes it fights itself. Experiment.

## Arrangements

The Arrangement dropdown controls how the IR gets structured and compiled into prompts. The default, "Auto (Conductor)," lets the system's AI conductor pick the best arrangement based on your IR content.

An arrangement is essentially a template for how visual information gets organized and weighted. Different arrangements emphasize different aspects of the IR:

- Some arrangements prioritize subject fidelity (face and form first, environment secondary)
- Others prioritize mood (lighting and palette first, subject details lighter)
- Some are optimized for specific output types (portraits, landscapes, character sheets)

When you manually select an arrangement, prompts recompile immediately. This is one of the fastest ways to get a different feel from the same IR: same visual DNA, different organizational priority.

### When to Change Arrangements

**The output is technically correct but doesn't feel right.** Your subject looks accurate but the mood is off. Try an arrangement that weights lighting and palette higher.

**You want the same reference to produce different composition styles.** A portrait arrangement versus an environmental arrangement will generate very different outputs from identical IR data.

**The Auto conductor keeps picking an arrangement you don't like.** Override it. The conductor is good but not psychic. If you know what you want, tell it.

### How to Explore Arrangements

The fastest exploration loop:

1. Extract your reference (Fuse)
2. Select an arrangement from the dropdown
3. Check the recompiled prompts (they update automatically)
4. If the prompt reads well, generate
5. If not, try another arrangement
6. Compare results in History

You don't need to re-extract between arrangement changes. The IR stays the same; only the compilation changes. This makes arrangement exploration very fast.

## Combining Anchors and Arrangements

Style anchors and arrangements work on different layers:

- **Anchors** add aesthetic vocabulary to the IR content
- **Arrangements** control how that content gets structured into prompts

Changing an anchor modifies *what* goes into the prompt. Changing an arrangement modifies *how* it's organized and weighted.

The most effective workflow: get your IR close through extraction and anchor editing, then cycle through arrangements to find the structural framing that produces the best output. This separates content decisions (what do I want?) from presentation decisions (how should I ask for it?).
