export type Channel = {
  id: string;
  created_at: string;
  language: string;
  description: string;
  img_url: string;
  name: string;
  category: string;
  // subcategory: $Nullable<string>;
  subcategory: string | null;
};
