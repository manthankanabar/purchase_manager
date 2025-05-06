import { useState, useEffect } from "react";
import useSWR from "swr";
import { Entity } from "../components/columns";

/**
 * Custom hook for fetching and managing entity data
 * 
 * @returns Object containing entities data, loading state, and mutate function
 */
export const useEntities = () => {
  // Use SWR for data fetching with caching and revalidation
  const { data, error, isLoading, mutate } = useSWR<Entity[]>(
    "/api/entities",
    async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch entities");
      }
      return response.json();
    }
  );

  return {
    entities: data,
    isLoading,
    isError: error,
    mutate,
  };
};
