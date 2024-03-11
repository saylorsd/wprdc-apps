import type { DatastoreRecord } from "@wprdc/types";
import { Suspense } from "react";
import type { APIResult } from "@wprdc/api";
import { Typography } from "../../../components";
import type {
  ConnectedSectionProps,
  DatastoreRecordSet,
  MultiConnectedSectionProps,
  MultiSourceSectionProps,
} from "../types";
import { SectionCard } from "./SectionCard";

export function ConnectedSection<T extends DatastoreRecord>({
  label,
  className,
  ...props
}: ConnectedSectionProps<T>): React.ReactElement {
  return (
    <SectionCard className={className} label={label}>
      <Suspense fallback="loading...">
        {/* @ts-expect-error Async Server Component */}
        <ConnectedSectionContent {...props} />
      </Suspense>
    </SectionCard>
  );
}

export async function ConnectedSectionContent<T extends DatastoreRecord>({
  getter,
  parcelID,
  section: Section,
  sectionProps,
}: Omit<ConnectedSectionProps<T>, "label">): Promise<React.ReactElement> {
  const { fields, records } = await getter(parcelID);
  if (!records || !fields)
    return <Typography.Note>Section empty</Typography.Note>;
  return <Section fields={fields} records={records} {...sectionProps} />;
}

export function MultiConnectedSection<T extends DatastoreRecordSet>({
  label,
  className,
  ...props
}: MultiConnectedSectionProps<T>): React.ReactElement {
  return (
    <SectionCard className={className} label={label}>
      <Suspense fallback="loading...">
        {/* @ts-expect-error Async Server Component */}
        <MultiConnectedSectionContent {...props} />
      </Suspense>
    </SectionCard>
  );
}

export async function MultiConnectedSectionContent<
  T extends DatastoreRecordSet,
>({
  getters,
  parcelID,
  section: Section,
  sectionProps,
}: Omit<MultiConnectedSectionProps<T>, "label">): Promise<React.ReactElement> {
  const keys: (keyof T)[] = Object.keys(getters);
  const results: APIResult<T[keyof T]>[] = await Promise.all(
    keys.map((k) => getters[k](parcelID)),
  );

  const childProps: MultiSourceSectionProps<T> = keys.reduce<
    Partial<MultiSourceSectionProps<T>>
  >(
    (acc, curr, i) => Object.assign(acc, { [curr]: results[i] }),
    {},
  ) as MultiSourceSectionProps<T>;

  return <Section {...childProps} {...sectionProps} />;
}
