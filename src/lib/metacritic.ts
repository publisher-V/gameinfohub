import { ApifyClient } from "apify-client";

const ACTOR_ID = process.env.APIFY_METACRITIC_ACTOR_ID ?? "jungle_synthesizer/metacritic-metascore-reviews-scraper";
const DEFAULT_LIMIT = 10;

export type MetacriticItem = {
  name?: string;
  title?: string;
  metascore?: number | string;
  score?: number | string;
  url?: string;
  link?: string;
} & Record<string, unknown>;

export type MetacriticDataset = {
  id: string;
  runId?: string;
  source: string;
};

export type MetacriticData = {
  items: MetacriticItem[];
  dataset: MetacriticDataset;
};

function getClient() {
  if (!process.env.APIFY_TOKEN) {
    throw new Error("Missing APIFY_TOKEN environment variable.");
  }

  return new ApifyClient({
    token: process.env.APIFY_TOKEN,
  });
}

function getItemLimit() {
  const limit = Number(process.env.APIFY_METACRITIC_MAX_ITEMS ?? DEFAULT_LIMIT);

  if (!Number.isFinite(limit) || limit < 1) {
    return DEFAULT_LIMIT;
  }

  return Math.min(Math.floor(limit), 100);
}

async function getLastSuccessfulRun(client: ApifyClient) {
  if (process.env.APIFY_METACRITIC_TASK_ID) {
    return client.task(process.env.APIFY_METACRITIC_TASK_ID).lastRun({ status: "SUCCEEDED" }).get();
  }

  return client.actor(ACTOR_ID).lastRun({ status: "SUCCEEDED" }).get();
}

async function resolveDataset(client: ApifyClient): Promise<MetacriticDataset> {
  if (process.env.APIFY_METACRITIC_DATASET_ID) {
    return {
      id: process.env.APIFY_METACRITIC_DATASET_ID,
      source: "configured-dataset",
    };
  }

  const run = await getLastSuccessfulRun(client);

  if (!run?.defaultDatasetId) {
    throw new Error("No successful Apify run with a default dataset was found.");
  }

  return {
    id: run.defaultDatasetId,
    runId: run.id,
    source: process.env.APIFY_METACRITIC_TASK_ID ? "task-last-successful-run" : "actor-last-successful-run",
  };
}

export async function getMetacriticData(): Promise<MetacriticData> {
  const client = getClient();
  const dataset = await resolveDataset(client);
  const { items } = await client.dataset<MetacriticItem>(dataset.id).listItems({
    clean: true,
    limit: getItemLimit(),
  });

  return {
    items,
    dataset,
  };
}
