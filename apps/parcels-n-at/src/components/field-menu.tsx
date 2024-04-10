"use client";

import { useEffect, useState } from "react";
import type { Key, Selection } from "react-aria-components";
import { Heading } from "@wprdc/ui";
import slugify from "slugify";
import { DatasetFieldMenu } from "@/components/dataset-field-menu";
import type { Dataset } from "@/datasets";

export interface FieldMenuProps {
  datasets: Record<string, Dataset[]>;
  onSelectionChange?: (selectionRecord: Record<string, "all" | Key[]>) => void;
}

export function FieldMenu({
  datasets,
  onSelectionChange,
}: FieldMenuProps): React.ReactElement {
  const [selectionByDataset, setSelectionByDataset] = useState<
    Record<string, Selection>
  >({});

  const handleSelectionChange = (dataset: string) => (selection: Selection) => {
    setSelectionByDataset({
      ...selectionByDataset,
      [dataset]: selection,
    });
  };

  useEffect(() => {
    if (onSelectionChange)
      onSelectionChange(
        Object.fromEntries(
          Object.entries(selectionByDataset).map(([k, v]) => [
            k,
            v === "all" ? "all" : Array.from(v),
          ]),
        ),
      );
  }, [onSelectionChange, selectionByDataset]);

  return (
    <div className="w-full overflow-auto">
      <div className="mx-auto h-full w-full max-w-screen-lg">
        {Object.entries(datasets).map(([title, menus]) => (
          <section className="pb-6" key={title}>
            <Heading id={slugify(title)} level={2}>
              {title}
            </Heading>
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
              {menus.map((menu) => (
                <DatasetFieldMenu
                  key={menu.title}
                  {...menu}
                  onSelectionChange={handleSelectionChange(menu.table)}
                  selection={selectionByDataset[menu.table]}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
