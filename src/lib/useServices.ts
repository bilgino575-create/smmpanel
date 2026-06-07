"use client";
// Loads the marketplace + headline service data (from /public/assets).
import { useEffect, useState } from "react";
import type { MarketService, HeadlineCard } from "./types";
import { api } from "./api";

export function useMarket() {
  const [services, setServices] = useState<MarketService[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    api.services()
      .then((j) => {
        if (alive) setServices(j.services || []);
      })
      .catch(() => {
        fetch("/assets/services_market.json")
          .then((r) => r.json())
          .then((j) => {
            if (alive) setServices(j.services || []);
          })
          .catch(() => {});
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);
  return { services, loading };
}

export function useHeadlineCards() {
  const [cards, setCards] = useState<HeadlineCard[]>([]);
  useEffect(() => {
    let alive = true;
    fetch("/assets/services.json")
      .then((r) => r.json())
      .then((j) => alive && setCards(j.cards || []))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return cards;
}
