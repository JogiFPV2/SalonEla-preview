import { supabase } from "./supabase";
import { Database } from "@/types/database.types";

// Services
export const getServices = async () => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at");

  if (error) throw error;
  return data;
};

export const createService = async (
  service: Database["public"]["Tables"]["services"]["Insert"],
) => {
  const { data, error } = await supabase
    .from("services")
    .insert(service)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateService = async (
  id: string,
  service: Database["public"]["Tables"]["services"]["Update"],
) => {
  const { data, error } = await supabase
    .from("services")
    .update(service)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteService = async (id: string) => {
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) throw error;
};

// Clients
export const getClients = async () => {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at");

  if (error) throw error;
  return data;
};

export const createClient = async (
  client: Database["public"]["Tables"]["clients"]["Insert"],
) => {
  const { data, error } = await supabase
    .from("clients")
    .insert(client)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateClient = async (
  id: string,
  client: Database["public"]["Tables"]["clients"]["Update"],
) => {
  const { data, error } = await supabase
    .from("clients")
    .update(client)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteClient = async (id: string) => {
  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) throw error;
};

// Appointments
export const getAppointments = async () => {
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      clients:client_id(*),
      services:service_id(*)
    `,
    )
    .order("date")
    .order("time");

  if (error) throw error;
  return data;
};

export const createAppointment = async ({
  client_id,
  service_ids,
  date,
  time,
}: {
  client_id: string;
  service_ids: string[];
  date: string;
  time: string;
}) => {
  // Create an appointment for each service
  const { data, error } = await supabase
    .from("appointments")
    .insert(
      service_ids.map((service_id) => ({
        client_id,
        service_id,
        date,
        time,
      })),
    )
    .select();

  if (error) throw error;
  return data;
};

export const updateAppointment = async (
  id: string,
  appointment: Database["public"]["Tables"]["appointments"]["Update"],
) => {
  const { data, error } = await supabase
    .from("appointments")
    .update(appointment)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteAppointment = async (id: string) => {
  const { error } = await supabase.from("appointments").delete().eq("id", id);

  if (error) throw error;
};
