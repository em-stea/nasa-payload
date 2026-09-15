import {getEPIC3DImages} from "@/features/home/services/get-epic-3d-images";
import {Container} from "@/shared/components/container/container";
import {HeaderGroup} from "@/shared/components/header-group/header-group";
import {Live} from "@/shared/components/icons/other/live";

import {EpicExplorer} from "./epic-explorer";

export default async function ThreeDEarth() {
  const captures = await getEPIC3DImages();

  return (
    <section className="relative my-10 w-full overflow-hidden bg-background-secondary py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 left-1/2 bg-linear-to-l from-primary/5 to-transparent"
      />

      <Container>
        <EpicExplorer captures={captures}>
          <HeaderGroup
            badge={{text: "LIVE TELEMETRY", icon: <Live className="size-5" />}}
            description="Earth Polychromatic Imaging Camera (EPIC). Positioned at the Earth-Sun Lagrange point 1, capturing daily, full-disc imagery of our home planet from deep space."
            title="Earth EPIC 3D"
          />
        </EpicExplorer>
      </Container>
    </section>
  );
}
