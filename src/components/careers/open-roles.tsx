import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";

import { RoleList } from "./role-list";

/** Open roles: a centered heading above the expandable list of sample openings. */
export function OpenRoles() {
  return (
    <Section id="roles" className="bg-sand py-[8vh]">
      <Reveal>
        <SectionHeading
          align="center"
          className="mb-[76px]"
          eyebrow="Open roles"
          title={
            <>
              Sample <Highlight>openings.</Highlight>
            </>
          }
          description="These are synthetic roles shown for this demo. Click any role to see what the work involves."
        />
      </Reveal>

      <RoleList />
    </Section>
  );
}
