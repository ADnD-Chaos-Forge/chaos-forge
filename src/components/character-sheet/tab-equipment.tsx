"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  calculateEncumbrance,
  getEncumbranceLabel,
  calculateAC,
  getMovementRate,
} from "@/lib/rules/equipment";
import { useTranslations } from "next-intl";
import type {
  CharacterEquipmentWithDetails,
  WeaponRow,
  ArmorRow,
  CharacterInventoryWithDetails,
  GeneralItemRow,
} from "@/lib/supabase/types";

interface TabEquipmentProps {
  characterId: string;
  userId: string;
  equipment: CharacterEquipmentWithDetails[];
  allWeapons: WeaponRow[];
  allArmor: ArmorRow[];
  strWeightAllow: number;
  dexDefenseAdj: number;
  inventory: CharacterInventoryWithDetails[];
  allGeneralItems: GeneralItemRow[];
  baseMovement: number;
}

export function TabEquipment({
  characterId,
  userId,
  equipment,
  allWeapons,
  allArmor,
  strWeightAllow,
  dexDefenseAdj,
  inventory,
  allGeneralItems,
  baseMovement,
}: TabEquipmentProps) {
  const router = useRouter();
  const t = useTranslations("equipment");
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addTab, setAddTab] = useState<"weapons" | "armor">("weapons");
  const [searchQuery, setSearchQuery] = useState("");
  const [weaponCategoryFilter, setWeaponCategoryFilter] = useState<
    "all" | "melee" | "ranged" | "both"
  >("all");
  const [showCustomWeaponForm, setShowCustomWeaponForm] = useState(false);
  const [showCustomArmorForm, setShowCustomArmorForm] = useState(false);
  const [customWeapon, setCustomWeapon] = useState({
    name: "",
    damage_sm: "",
    damage_l: "",
    speed: "",
    weight: "",
    cost_gp: "",
  });
  const [customArmor, setCustomArmor] = useState({ name: "", ac: "", weight: "", cost_gp: "" });

  const [showAddInventory, setShowAddInventory] = useState(false);
  const [inventorySearch, setInventorySearch] = useState("");
  const [customItemName, setCustomItemName] = useState("");

  const equipmentWeight = equipment.reduce((sum, item) => {
    const weight = item.weapon?.weight ?? item.armor?.weight ?? 0;
    return sum + weight * item.quantity;
  }, 0);

  const inventoryWeight = inventory.reduce((sum, item) => {
    const weight = item.item?.weight ?? 0;
    return sum + weight * item.quantity;
  }, 0);

  const totalWeight = equipmentWeight + inventoryWeight;

  const encumbranceLevel = calculateEncumbrance(totalWeight, strWeightAllow);
  const encumbranceLabel = getEncumbranceLabel(encumbranceLevel);

  const equippedArmor = equipment.find(
    (e) => e.armor && e.equipped && e.armor.name.toLowerCase() !== "schild"
  );
  const shieldEquipped = equipment.some(
    (e) =>
      e.armor &&
      e.equipped &&
      (e.armor.name.toLowerCase() === "schild" || e.armor.name.toLowerCase() === "shield")
  );
  const currentAC = calculateAC(equippedArmor?.armor?.ac ?? null, shieldEquipped, dexDefenseAdj);

  const equippedItems = equipment.filter((e) => e.equipped);
  const inventoryItems = equipment;

  async function toggleEquip(item: CharacterEquipmentWithDetails) {
    setLoading(true);
    const supabase = createClient();
    const newEquipped = !item.equipped;

    // If equipping armor (non-shield), unequip any currently equipped armor first
    if (
      newEquipped &&
      item.armor &&
      item.armor.name.toLowerCase() !== "schild" &&
      item.armor.name.toLowerCase() !== "shield"
    ) {
      const currentArmors = equipment.filter(
        (e) =>
          e.armor &&
          e.equipped &&
          e.id !== item.id &&
          e.armor.name.toLowerCase() !== "schild" &&
          e.armor.name.toLowerCase() !== "shield"
      );
      for (const a of currentArmors) {
        await supabase.from("character_equipment").update({ equipped: false }).eq("id", a.id);
      }
    }

    await supabase.from("character_equipment").update({ equipped: newEquipped }).eq("id", item.id);

    setLoading(false);
    router.refresh();
  }

  async function removeItem(itemId: string) {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("character_equipment").delete().eq("id", itemId);
    setLoading(false);
    router.refresh();
  }

  async function addItem(type: "weapon" | "armor", id: string) {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("character_equipment").insert({
      character_id: characterId,
      weapon_id: type === "weapon" ? id : null,
      armor_id: type === "armor" ? id : null,
      quantity: 1,
      equipped: false,
    });
    setLoading(false);
    setShowAddDialog(false);
    router.refresh();
  }

  const filteredWeapons = allWeapons.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      weaponCategoryFilter === "all" || w.weapon_type === weaponCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredArmor = allArmor.filter((a) => {
    return a.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  async function createCustomWeapon() {
    if (!customWeapon.name.trim()) return;
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("weapons")
      .insert({
        name: customWeapon.name.trim(),
        damage_sm: customWeapon.damage_sm.trim(),
        damage_l: customWeapon.damage_l.trim(),
        speed: customWeapon.speed ? Number(customWeapon.speed) : 0,
        weight: customWeapon.weight ? Number(customWeapon.weight) : 0,
        cost_gp: customWeapon.cost_gp ? Number(customWeapon.cost_gp) : 0,
        is_custom: true,
        created_by: userId,
      })
      .select()
      .single();

    if (!error && data) {
      await addItem("weapon", data.id);
      setCustomWeapon({
        name: "",
        damage_sm: "",
        damage_l: "",
        speed: "",
        weight: "",
        cost_gp: "",
      });
      setShowCustomWeaponForm(false);
    }
    setLoading(false);
  }

  async function createCustomArmor() {
    if (!customArmor.name.trim()) return;
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("armor")
      .insert({
        name: customArmor.name.trim(),
        ac: customArmor.ac ? Number(customArmor.ac) : 10,
        weight: customArmor.weight ? Number(customArmor.weight) : 0,
        cost_gp: customArmor.cost_gp ? Number(customArmor.cost_gp) : 0,
        is_custom: true,
        created_by: userId,
      })
      .select()
      .single();

    if (!error && data) {
      await addItem("armor", data.id);
      setCustomArmor({ name: "", ac: "", weight: "", cost_gp: "" });
      setShowCustomArmorForm(false);
    }
    setLoading(false);
  }

  function getEncumbranceBadgeVariant(level: string) {
    switch (level) {
      case "unencumbered":
        return "secondary" as const;
      case "light":
        return "outline" as const;
      case "moderate":
        return "outline" as const;
      case "heavy":
        return "destructive" as const;
      case "severe":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  }

  const movementRate = getMovementRate(baseMovement, encumbranceLevel);

  async function addInventoryItem(itemId: string | null, name: string | null) {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("character_inventory").insert({
      character_id: characterId,
      item_id: itemId,
      custom_name: name,
      quantity: 1,
    });
    setLoading(false);
    setShowAddInventory(false);
    setInventorySearch("");
    setCustomItemName("");
    router.refresh();
  }

  async function removeInventoryItem(id: string) {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("character_inventory").delete().eq("id", id);
    setLoading(false);
    router.refresh();
  }

  async function updateInventoryQuantity(id: string, quantity: number) {
    const supabase = createClient();
    await supabase.from("character_inventory").update({ quantity }).eq("id", id);
    router.refresh();
  }

  function getItemName(item: CharacterEquipmentWithDetails): string {
    return item.weapon?.name ?? item.armor?.name ?? "—";
  }

  function getItemWeight(item: CharacterEquipmentWithDetails): number {
    return item.weapon?.weight ?? item.armor?.weight ?? 0;
  }

  function getItemType(item: CharacterEquipmentWithDetails): string {
    if (item.weapon) {
      switch (item.weapon.weapon_type) {
        case "melee":
          return t("melee");
        case "ranged":
          return t("ranged");
        case "both":
          return t("meleAndRanged");
      }
    }
    if (item.armor) return t("armor");
    return "";
  }

  return (
    <div className="flex flex-col gap-6" data-testid="tab-equipment">
      {/* Summary Row: AC + Encumbrance */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-border p-4 text-center">
          <div className="text-xs text-muted-foreground">{t("acBreakdown")}</div>
          <div className="font-heading text-3xl text-primary" data-testid="equipment-ac">
            {currentAC}
          </div>
          <div className="text-xs text-muted-foreground">
            {equippedArmor ? equippedArmor.armor!.name : t("noArmor")}
            {shieldEquipped ? ` + ${t("shield")}` : ""}
          </div>
        </div>
        <div className="rounded-md border border-border p-4 text-center">
          <div className="text-xs text-muted-foreground">{t("totalWeight")}</div>
          <div className="font-heading text-3xl text-primary" data-testid="equipment-total-weight">
            {totalWeight}
          </div>
          <div className="text-xs text-muted-foreground">{t("pounds")}</div>
        </div>
        <div className="rounded-md border border-border p-4 text-center">
          <div className="text-xs text-muted-foreground">{t("encumbrance")}</div>
          <div className="mt-1" data-testid="equipment-encumbrance">
            <Badge variant={getEncumbranceBadgeVariant(encumbranceLevel)}>{encumbranceLabel}</Badge>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {t("maxWeight", { weight: strWeightAllow })}
          </div>
        </div>
      </div>

      {/* Equipped Items */}
      <div>
        <h3 className="mb-3 font-heading text-lg">{t("equipped")}</h3>
        {equippedItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noEquipped")}</p>
        ) : (
          <div className="flex flex-col gap-2">
            {equippedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-md border border-border p-3"
                data-testid={`equipped-item-${item.id}`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{getItemName(item)}</span>
                  <Badge variant="outline">{getItemType(item)}</Badge>
                  {item.weapon && (
                    <span className="text-xs text-muted-foreground">
                      {t("damage")}: {item.weapon.damage_sm}/{item.weapon.damage_l} | {t("speed")}:{" "}
                      {item.weapon.speed}
                    </span>
                  )}
                  {item.armor && (
                    <span className="text-xs text-muted-foreground">
                      {t("acValue")}: {item.armor.ac}
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={() => toggleEquip(item)}
                  data-testid={`unequip-btn-${item.id}`}
                >
                  {t("unequip")}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inventory */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-heading text-lg">{t("inventory")}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddDialog(true)}
            data-testid="add-item-btn"
          >
            {t("addItem")}
          </Button>
        </div>
        {inventoryItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noItems")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="inventory-table">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-2 pr-4">{t("itemLabel")}</th>
                  <th className="pb-2 pr-4">{t("typeLabel")}</th>
                  <th className="pb-2 pr-4 text-right">{t("weight")}</th>
                  <th className="pb-2 pr-4 text-right">{t("quantity")}</th>
                  <th className="pb-2 pr-4 text-center">{t("statusLabel")}</th>
                  <th className="pb-2 text-right">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border/50"
                    data-testid={`inventory-row-${item.id}`}
                  >
                    <td className="py-2 pr-4 font-medium">{getItemName(item)}</td>
                    <td className="py-2 pr-4">
                      <Badge variant="outline">{getItemType(item)}</Badge>
                    </td>
                    <td className="py-2 pr-4 text-right font-mono">{getItemWeight(item)}</td>
                    <td className="py-2 pr-4 text-right font-mono">{item.quantity}</td>
                    <td className="py-2 pr-4 text-center">
                      <Button
                        variant={item.equipped ? "default" : "outline"}
                        size="xs"
                        disabled={loading}
                        onClick={() => toggleEquip(item)}
                        data-testid={`equip-toggle-${item.id}`}
                      >
                        {item.equipped ? t("equipped") : t("equip")}
                      </Button>
                    </td>
                    <td className="py-2 text-right">
                      <Button
                        variant="destructive"
                        size="xs"
                        disabled={loading}
                        onClick={() => removeItem(item.id)}
                        data-testid={`remove-item-${item.id}`}
                      >
                        {t("remove")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Item Dialog (simple overlay) */}
      {showAddDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          data-testid="add-item-dialog"
        >
          <div className="mx-4 max-h-[80vh] w-full max-w-lg overflow-hidden rounded-lg border border-border bg-background shadow-lg">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h3 className="font-heading text-lg">{t("addItem")}</h3>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowAddDialog(false)}
                data-testid="close-add-dialog-btn"
              >
                &times;
              </Button>
            </div>

            {/* Tab switcher */}
            <div className="flex border-b border-border">
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  addTab === "weapons"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setAddTab("weapons")}
                data-testid="add-dialog-tab-weapons"
              >
                {t("weapons")}
              </button>
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  addTab === "armor"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setAddTab("armor")}
                data-testid="add-dialog-tab-armor"
              >
                {t("armor")}
              </button>
            </div>

            {/* Search field */}
            <div className="border-b border-border p-4 pb-3">
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="equipment-search"
              />

              {/* Category filter for weapons */}
              {addTab === "weapons" && (
                <div className="mt-2 flex gap-1">
                  {(
                    [
                      { key: "all", label: t("filterAll") },
                      { key: "melee", label: t("melee") },
                      { key: "ranged", label: t("ranged") },
                      { key: "both", label: t("both") },
                    ] as const
                  ).map((filter) => (
                    <button
                      key={filter.key}
                      className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                        weaponCategoryFilter === filter.key
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setWeaponCategoryFilter(filter.key)}
                      data-testid={`equipment-filter-${filter.key}`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Item list */}
            <div className="max-h-[50vh] overflow-y-auto p-4">
              {addTab === "weapons" && (
                <div className="flex flex-col gap-2">
                  {filteredWeapons.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("noWeapons")}</p>
                  ) : (
                    filteredWeapons.map((weapon) => (
                      <div
                        key={weapon.id}
                        className="flex items-center justify-between rounded-md border border-border p-3"
                        data-testid={`add-weapon-${weapon.id}`}
                      >
                        <div>
                          <div className="font-medium">{weapon.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {t("damage")}: {weapon.damage_sm}/{weapon.damage_l} | {t("speed")}:{" "}
                            {weapon.speed} | {t("weight")}: {weapon.weight} | {t("cost")}:{" "}
                            {weapon.cost_gp} GP
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={loading}
                          onClick={() => addItem("weapon", weapon.id)}
                          data-testid={`add-weapon-btn-${weapon.id}`}
                        >
                          {t("addItem")}
                        </Button>
                      </div>
                    ))
                  )}

                  {/* Custom weapon creation */}
                  <div className="mt-2 border-t border-border pt-3">
                    {!showCustomWeaponForm ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setShowCustomWeaponForm(true)}
                        data-testid="create-custom-weapon-toggle"
                      >
                        {t("createCustomWeapon")}
                      </Button>
                    ) : (
                      <div
                        className="flex flex-col gap-2 rounded-md border border-border p-3"
                        data-testid="custom-weapon-form"
                      >
                        <div className="text-sm font-medium">{t("createCustomWeapon")}</div>
                        <input
                          type="text"
                          placeholder={t("name")}
                          value={customWeapon.name}
                          onChange={(e) =>
                            setCustomWeapon({ ...customWeapon, name: e.target.value })
                          }
                          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          data-testid="custom-weapon-name"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder={t("damageSM")}
                            value={customWeapon.damage_sm}
                            onChange={(e) =>
                              setCustomWeapon({ ...customWeapon, damage_sm: e.target.value })
                            }
                            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            data-testid="custom-weapon-damage-sm"
                          />
                          <input
                            type="text"
                            placeholder={t("damageL")}
                            value={customWeapon.damage_l}
                            onChange={(e) =>
                              setCustomWeapon({ ...customWeapon, damage_l: e.target.value })
                            }
                            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            data-testid="custom-weapon-damage-l"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="number"
                            placeholder={t("speed")}
                            value={customWeapon.speed}
                            onChange={(e) =>
                              setCustomWeapon({ ...customWeapon, speed: e.target.value })
                            }
                            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            data-testid="custom-weapon-speed"
                          />
                          <input
                            type="number"
                            placeholder={t("weight")}
                            value={customWeapon.weight}
                            onChange={(e) =>
                              setCustomWeapon({ ...customWeapon, weight: e.target.value })
                            }
                            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            data-testid="custom-weapon-weight"
                          />
                          <input
                            type="number"
                            placeholder={t("cost")}
                            value={customWeapon.cost_gp}
                            onChange={(e) =>
                              setCustomWeapon({ ...customWeapon, cost_gp: e.target.value })
                            }
                            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            data-testid="custom-weapon-cost"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            disabled={loading || !customWeapon.name.trim()}
                            onClick={createCustomWeapon}
                            data-testid="custom-weapon-submit"
                          >
                            {t("createAndAdd")}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowCustomWeaponForm(false);
                              setCustomWeapon({
                                name: "",
                                damage_sm: "",
                                damage_l: "",
                                speed: "",
                                weight: "",
                                cost_gp: "",
                              });
                            }}
                            data-testid="custom-weapon-cancel"
                          >
                            {t("cancel")}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {addTab === "armor" && (
                <div className="flex flex-col gap-2">
                  {filteredArmor.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("noArmorAvailable")}</p>
                  ) : (
                    filteredArmor.map((armor) => (
                      <div
                        key={armor.id}
                        className="flex items-center justify-between rounded-md border border-border p-3"
                        data-testid={`add-armor-${armor.id}`}
                      >
                        <div>
                          <div className="font-medium">{armor.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {t("acValue")}: {armor.ac} | {t("weight")}: {armor.weight} | {t("cost")}
                            : {armor.cost_gp} GP
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={loading}
                          onClick={() => addItem("armor", armor.id)}
                          data-testid={`add-armor-btn-${armor.id}`}
                        >
                          {t("addItem")}
                        </Button>
                      </div>
                    ))
                  )}

                  {/* Custom armor creation */}
                  <div className="mt-2 border-t border-border pt-3">
                    {!showCustomArmorForm ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setShowCustomArmorForm(true)}
                        data-testid="create-custom-armor-toggle"
                      >
                        {t("createCustomArmor")}
                      </Button>
                    ) : (
                      <div
                        className="flex flex-col gap-2 rounded-md border border-border p-3"
                        data-testid="custom-armor-form"
                      >
                        <div className="text-sm font-medium">{t("createCustomArmor")}</div>
                        <input
                          type="text"
                          placeholder={t("name")}
                          value={customArmor.name}
                          onChange={(e) => setCustomArmor({ ...customArmor, name: e.target.value })}
                          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          data-testid="custom-armor-name"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="number"
                            placeholder={t("acValue")}
                            value={customArmor.ac}
                            onChange={(e) => setCustomArmor({ ...customArmor, ac: e.target.value })}
                            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            data-testid="custom-armor-ac"
                          />
                          <input
                            type="number"
                            placeholder={t("weight")}
                            value={customArmor.weight}
                            onChange={(e) =>
                              setCustomArmor({ ...customArmor, weight: e.target.value })
                            }
                            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            data-testid="custom-armor-weight"
                          />
                          <input
                            type="number"
                            placeholder={t("cost")}
                            value={customArmor.cost_gp}
                            onChange={(e) =>
                              setCustomArmor({ ...customArmor, cost_gp: e.target.value })
                            }
                            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            data-testid="custom-armor-cost"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            disabled={loading || !customArmor.name.trim()}
                            onClick={createCustomArmor}
                            data-testid="custom-armor-submit"
                          >
                            {t("createAndAdd")}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowCustomArmorForm(false);
                              setCustomArmor({ name: "", ac: "", weight: "", cost_gp: "" });
                            }}
                            data-testid="custom-armor-cancel"
                          >
                            {t("cancel")}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Weapon Details (Equipped Weapons) ──────────────────── */}
      {equippedItems.filter((e) => e.weapon).length > 0 && (
        <div>
          <h3 className="mb-3 font-heading text-lg">{t("weapons")}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-2">{t("name")}</th>
                  <th className="py-2 text-center">{t("damageSM")}</th>
                  <th className="py-2 text-center">{t("damageL")}</th>
                  <th className="py-2 text-center">{t("speed")}</th>
                  <th className="py-2 text-center">{t("weight")}</th>
                </tr>
              </thead>
              <tbody>
                {equippedItems
                  .filter((e) => e.weapon)
                  .map((item) => (
                    <tr key={item.id} className="border-b border-border/50">
                      <td className="py-2 font-medium">{item.weapon!.name}</td>
                      <td className="py-2 text-center font-mono">{item.weapon!.damage_sm}</td>
                      <td className="py-2 text-center font-mono">{item.weapon!.damage_l}</td>
                      <td className="py-2 text-center font-mono">{item.weapon!.speed}</td>
                      <td className="py-2 text-center font-mono">{item.weapon!.weight}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── AC Breakdown ──────────────────────────────────────── */}
      <div>
        <h3 className="mb-3 font-heading text-lg">{t("acBreakdown")}</h3>
        <div className="grid grid-cols-5 gap-2 text-center text-sm">
          <div className="rounded-md border border-border p-2">
            <div className="text-xs text-muted-foreground">{t("base")}</div>
            <div className="font-mono text-lg">10</div>
          </div>
          <div className="rounded-md border border-border p-2">
            <div className="text-xs text-muted-foreground">{t("armor")}</div>
            <div className="font-mono text-lg">{equippedArmor ? equippedArmor.armor!.ac : "—"}</div>
          </div>
          <div className="rounded-md border border-border p-2">
            <div className="text-xs text-muted-foreground">{t("shield")}</div>
            <div className="font-mono text-lg">{shieldEquipped ? "-1" : "—"}</div>
          </div>
          <div className="rounded-md border border-border p-2">
            <div className="text-xs text-muted-foreground">DEX</div>
            <div className="font-mono text-lg">
              {dexDefenseAdj !== 0 ? `${dexDefenseAdj >= 0 ? "+" : ""}${dexDefenseAdj}` : "—"}
            </div>
          </div>
          <div className="rounded-md border border-primary p-2">
            <div className="text-xs text-muted-foreground">{t("acValue")}</div>
            <div className="font-heading text-lg text-primary">{currentAC}</div>
          </div>
        </div>
      </div>

      {/* ── Movement & Encumbrance ────────────────────────────── */}
      <div>
        <h3 className="mb-3 font-heading text-lg">{t("movement")}</h3>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="rounded-md border border-border p-3">
            <div className="text-xs text-muted-foreground">{t("baseMovement")}</div>
            <div className="font-heading text-2xl text-primary">{baseMovement}</div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="text-xs text-muted-foreground">{t("currentMovement")}</div>
            <div className="font-heading text-2xl text-primary" data-testid="equipment-movement">
              {movementRate}
            </div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="text-xs text-muted-foreground">{t("encumbrance")}</div>
            <Badge variant={getEncumbranceBadgeVariant(encumbranceLevel)}>{encumbranceLabel}</Badge>
          </div>
        </div>
      </div>

      {/* ── General Inventory ─────────────────────────────────── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-heading text-lg">{t("inventoryTitle")}</h3>
          <Button
            size="sm"
            onClick={() => setShowAddInventory(true)}
            data-testid="add-inventory-btn"
          >
            {t("addItem")}
          </Button>
        </div>

        {inventory.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noInventory")}</p>
        ) : (
          <div className="flex flex-col gap-2">
            {inventory.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between rounded-md border border-border p-2"
                data-testid={`inventory-item-${inv.id}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{inv.item?.name ?? inv.custom_name ?? "—"}</span>
                  <span className="text-xs text-muted-foreground">
                    {inv.item ? `${inv.item.weight} lbs` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={inv.quantity}
                    onChange={(e) =>
                      updateInventoryQuantity(inv.id, Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-14 rounded border border-input bg-input px-2 py-1 text-center text-sm"
                  />
                  <Button variant="ghost" size="sm" onClick={() => removeInventoryItem(inv.id)}>
                    ✕
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Inventory Dialog */}
        {showAddInventory && (
          <div className="mt-3 rounded-md border border-border p-4">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={inventorySearch}
              onChange={(e) => setInventorySearch(e.target.value)}
              className="mb-3 w-full rounded-md border border-input bg-input px-3 py-2 text-sm"
              data-testid="inventory-search"
            />
            <div className="mb-3 max-h-48 overflow-y-auto">
              {allGeneralItems
                .filter(
                  (item) =>
                    item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                    (item.name_en ?? "").toLowerCase().includes(inventorySearch.toLowerCase())
                )
                .map((item) => (
                  <button
                    key={item.id}
                    className="flex w-full items-center justify-between px-2 py-1 text-left text-sm hover:bg-muted"
                    onClick={() => addInventoryItem(item.id, null)}
                    data-testid={`inventory-option-${item.id}`}
                  >
                    <span>{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.weight > 0 ? `${item.weight} lbs` : ""}{" "}
                      {item.cost_gp > 0 ? `${item.cost_gp} GP` : ""}
                    </span>
                  </button>
                ))}
            </div>
            <div className="flex gap-2 border-t border-border pt-3">
              <input
                type="text"
                placeholder={t("customItemPlaceholder")}
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
                className="flex-1 rounded-md border border-input bg-input px-3 py-2 text-sm"
                data-testid="custom-item-name"
              />
              <Button
                size="sm"
                disabled={!customItemName.trim()}
                onClick={() => addInventoryItem(null, customItemName.trim())}
                data-testid="add-custom-item-btn"
              >
                {t("addItem")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddInventory(false);
                  setInventorySearch("");
                  setCustomItemName("");
                }}
              >
                ✕
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
