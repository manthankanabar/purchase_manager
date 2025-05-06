"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { EntityForm } from "./components/entity-form";
import { useEntities } from "./hooks/use-entities";
import { columns } from "./components/columns";

export default function EntitiesPage() {
  const [open, setOpen] = useState(false);
  const [entityId, setEntityId] = useState<string | null>(null);
  const { entities, isLoading, mutate } = useEntities();

  const onCreateClick = () => {
    setEntityId(null);
    setOpen(true);
  };

  const onEditClick = (id: string) => {
    setEntityId(id);
    setOpen(true);
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Entities"
            description="Manage your company entities"
          />
          <Button onClick={onCreateClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
        <Separator />
        <DataTable
          columns={columns}
          data={entities || []}
          isLoading={isLoading}
          onEdit={onEditClick}
          searchKey="name"
        />
        <EntityForm
          open={open}
          setOpenAction={setOpen}
          entityId={entityId}
          onSuccessAction={() => mutate()}
        />
      </div>
    </div>
  );
}
