import type { Insertable, Selectable, Updateable } from "kysely";

import type {
  NonUpdatableIdColumnType,
  NonUpdatableDateTimeColumnType,
  UpdatableDateTimeColumnType,
} from "./types/index.js";

/**
 * Content crawled from Github repos
 */
export interface ContentGithubRepoTable {
  /**
   * UUID
   */
  id: NonUpdatableIdColumnType;

  /**
   * Full name of the github repo, usually consists of owner_username/repo_name
   */
  full_name: string;

  /**
   * Owner's username
   */
  owner: string;

  /**
   * Repo's name
   */
  repo_name: string;

  /**
   * URL to the repo
   */
  repo_url: string;

  /**
   * The primary programming language of this repo (note this is the primary
   * since some projects can have more than 1)
   */
  language: string;

  /**
   * Number of github stars on this repo
   */
  stars: number;

  /**
   * Number of github stars this repo gained today
   */
  stars_today: number;

  /**
   * Number of github forks of this repo
   */
  forks: number;

  /**
   * Description text of this repo
   */
  description: string;

  /**
   * Readme text of this repo
   */
  readme_text: $Nullable<string>;

  /**
   * String status of succcess/not_found
   */
  readme_status: string;

  /**
   * When this repo first start trending?
   */
  trending_date: NonUpdatableDateTimeColumnType;

  /**
   * When did we last crawl and update this information?
   */
  crawled_at: UpdatableDateTimeColumnType;
}

export type ContentGithubRepo = Selectable<ContentGithubRepoTable>;
export type CreateContentGithubRepo = Insertable<ContentGithubRepoTable>;
export type UpdateContentGithubRepo = Updateable<ContentGithubRepoTable>;
