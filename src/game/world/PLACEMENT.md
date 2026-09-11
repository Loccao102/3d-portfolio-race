# Purposeful World Placement

The portfolio city is not a prop scatter scene. Every placed object must support circulation, safety, navigation, district identity, service logic, social use, shade, drainage or visual framing.

## Non-negotiable rules

1. **Driving lane first** — decorative geometry never steals the primary racing/driving corridor.
2. **Sightline first** — district landmarks and gateway labels must be readable from the approach road.
3. **Cluster by use** — benches, shelter, planters, lamps and service props form believable use clusters instead of isolated decoration.
4. **Cause and effect** — wet surfaces need a runoff/service source; rubber wear belongs to braking zones; drains sit where water would actually collect.
5. **District identity** — props facing a district must reinforce what that district means.
6. **Sparse by default** — if an object has no `zone`, `role` and `purpose`, remove it.

The typed source of truth for street-scale placement is `world/data/placementPlan.ts` and `world/data/roadSurfacePlan.ts`.

## District intent

### Central junction
- Function: orientation + traffic conflict point.
- Allowed props: crosswalks, signals, corner barriers, braking wear.
- Avoid: decorative trees, billboards or landmarks that block four-way visibility.

### About promenade
- Function: warm human-scale arrival into personal story.
- Allowed props: shade trees, lanterns, planters, residential detail, social lighting.
- Visual language: warm timber, amber, greenery, Vietnamese courtyard cues.

### Tech corridor
- Function: reveal the data-pagoda and backend/cloud identity.
- Allowed props: controlled cool lighting, antennas, clean framing trees, technical wayfinding.
- Avoid: clutter that hides the pagoda silhouette.

### Projects forecourt
- Function: workshop/garage arrival and public-facing project display.
- Allowed props: transit shelter, service drainage, workshop runoff, industrial lighting, garage signage.
- Visual language: practical infrastructure, working space, not decorative sci-fi.

### Experiments service edge
- Function: lab/research campus with visible support infrastructure.
- Allowed props: cooling/service runoff, drains, antennas, service lighting, kinetic landmark framing.
- Visual language: experimental but still physically explainable.

### Contact approach
- Function: long final visual pull toward the signal-lotus/contact station.
- Allowed props: paired navigation lights, communication hardware, clean sightline.
- Avoid: foreground clutter that weakens the long-axis composition.

## Review checklist for any new prop

Before committing a new object, answer all five:

- Which zone owns it?
- What role does it serve?
- Why is it at this exact location?
- Does it preserve driving clearance and landmark sightlines?
- Would the scene communicate worse if it were removed?

If those answers are weak, do not add the object.
