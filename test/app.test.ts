import fs from "fs";
import { setupStrapi, cleanupStrapi } from "./strapi";

declare const strapi: any;

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  await cleanupStrapi();
});

it("strapi is defined", () => {
  expect(strapi).toBeDefined();
});
