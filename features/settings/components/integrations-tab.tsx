"use client";

import { useState } from "react";

import { MOCK_INTEGRATIONS } from "../services/mock-data";
import type { Integration } from "../types";
import { IntegrationCard } from "./integration-card";

export function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<Integration[]>(MOCK_INTEGRATIONS);

  function handleDisconnect(id: string) {
    setIntegrations((current) =>
      current.map((item) => (item.id === id ? { ...item, connected: false } : item)),
    );
  }

  function handleConnect(id: string) {
    setIntegrations((current) =>
      current.map((item) => (item.id === id ? { ...item, connected: true } : item)),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {integrations.map((integration) => (
        <IntegrationCard
          key={integration.id}
          integration={integration}
          onDisconnect={() => handleDisconnect(integration.id)}
          onConnect={() => handleConnect(integration.id)}
        />
      ))}
    </div>
  );
}
