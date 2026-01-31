export type PodcastChannel = {
  id: string;
  created_at: string;
  language: string;
  description: string;
  img_url: string;
  name: string;
  category_primary: string | null;
  subcategory_primary: string | null;
  category_secondary: string | null;
  subcategory_secondary: string | null;
};
