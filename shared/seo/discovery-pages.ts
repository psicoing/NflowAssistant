import { buildDiscoveryPages } from "./discovery/shared";
import { esDiscovery } from "./discovery/es";
import { enUsDiscovery } from "./discovery/en-us";
import { enGbDiscovery } from "./discovery/en-gb";
import { frDiscovery } from "./discovery/fr";

export const discoveryPages = [
  ...buildDiscoveryPages("es", esDiscovery),
  ...buildDiscoveryPages("en-us", enUsDiscovery),
  ...buildDiscoveryPages("en-gb", enGbDiscovery),
  ...buildDiscoveryPages("fr", frDiscovery),
];
