export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

export const formatReadingTime = (min: number) => `${min} min de leitura`;