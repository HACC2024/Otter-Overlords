"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Dataset = {
  id: string
  title: string
  notes: string
  format: string[]
  organization: { id: string; name: string; title: string }
  groups: { id: string; title: string }[]
  tags: { active: boolean; name: string }[]
}

export const columns: ColumnDef<Dataset>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    accessorKey: "format",
    header: "Format",
    cell: ({ row }) => {
      if (Array.isArray(row.original.format)) {
        return row.original.format.join(", ");
      }
      return "N/A"; // Handle non-array values gracefully
    },
  },
  {
    accessorKey: "organization.title",
    header: "Organization",
    cell: ({ row }) => {
      if (row.original.organization?.title) {
        return row.original.organization.title;
      }
      return "N/A";
    },
  },
  {
    accessorKey: "groups",
    header: "Group(s)",
    cell: ({ row }) => {
      if (row.original.groups && Array.isArray(row.original.groups)) {
        return row.original.groups.map(group => group.title).join(", ");
      }
      return "N/A"; // Handle null/undefined or non-array values
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      if (Array.isArray(row.original.tags)) {
        return row.original.tags.map(tag => tag.name).join(", ");
      }
      return "N/A"; // Handle non-array values
    },
  },
];
