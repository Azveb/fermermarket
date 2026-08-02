"use client";
import Icon from "@/components/ui/Icon";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useToast } from "@/components/ui/Toast";

const SECTION_ORDER = [
  { key: "general", label: "Ümumi ayarlar", iconName: "settings" },
  { key: "commerce", label: "Ticarət", iconName: "cart" },
  { key: "content", label: "Məzmun", iconName: "fileText" },
  { key: "access", label: "Giriş və icazə", iconName: "lock" },
];

const FIELD_DEFS = {
  general: [
    { key: "siteName", label: "Sayt adı", type: "text" },
    { key: "tagline", label: "Açıqlama", type: "text" },
    { key: "currency", label: "Valyuta", type: "text" },
    { key: "locale", label: "Dil", type: "select", options: ["AZ", "EN", "RU"] },
    { key: "maintenanceMode", label: "Bakım modu", type: "toggle" },
  ],
  commerce: [
    { key: "allowRegistration", label: "Qeydiyyat açıqdır", type: "toggle" },
    { key: "allowListings", label: "Elan yerləşdirməyə icazə", type: "toggle" },
    { key: "allowReviews", label: "Rəy yazmağa icazə", type: "toggle" },
    { key: "allowWallet", label: "Pul kisəsi aktivdir", type: "toggle" },
    { key: "allowCoupons", label: "Kupon sistemi aktivdir", type: "toggle" },
    { key: "allowBundles", label: "Bağlamalar aktivdir", type: "toggle" },
  ],
  content: [
    { key: "allowBlog", label: "Bloq aktivdir", type: "toggle" },
    { key: "allowPush", label: "Push bildirişləri aktivdir", type: "toggle" },
    { key: "allowCampaigns", label: "Kampaniyalar aktivdir", type: "toggle" },
    { key: "allowStores", label: "Mağaza moderasiyası aktivdir", type: "toggle" },
    { key: "showAnalytics", label: "Analitika göstərilsin", type: "toggle" },
  ],
  access: [
    { key: "enableAdminAudit", label: "Admin audit log", type: "toggle" },
    { key: "require2FA", label: "2FA tələb et", type: "toggle" },
  ],
};

export default function NoCodeAdminStudio() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, ToastContainer } = useToast();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetch("/api/admin/studio");
      setConfig(data.config || {});
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    try {
      const data = await apiFetch("/api/admin/studio", { method: "POST", body: JSON.stringify(config) });
      setConfig(data.config || config);
      toast("Ayarlar yadda saxlanıldı", "success");
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setSaving(false);
    }
  }

  function updateField(key, value) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  const summary = useMemo(() => {
    if (!config) return [];
    return [
      { label: "Sayt", value: config.siteName || "FermerMarket" },
      { label: "Valyuta", value: config.currency || "AZN" },
      { label: "Qeydiyyat", value: config.allowRegistration ? "Açıq" : "Bağlı" },
      { label: "Analitika", value: config.showAnalytics ? "Aktiv" : "Deaktiv" },
    ];
  }, [config]);

  if (loading) {
    return <div className="card p-6 text-sm text-gray-500">Yüklənir...</div>;
  }

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="section-title">No-Code Admin Studio</h2>
          <p className="section-subtitle">Bu panel vasitəsilə əsas sistem davranışlarını no-code şəkildə idarə edin.</p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary btn-sm">{saving ? "Yadda saxlanır..." : "Yadda saxla"}</button>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        {summary.map((item) => (
          <div key={item.label} className="card p-4">
            <p className="text-[11px] uppercase tracking-wider text-gray-400">{item.label}</p>
            <p className="mt-1 font-semibold text-sm text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[220px,1fr] gap-4">
        <div className="card p-3 h-fit">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Bölmələr</p>
          <div className="space-y-1">
            {SECTION_ORDER.map((section) => (
              <div key={section.key} className="rounded-xl px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50">
                {section.icon} {section.label}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {SECTION_ORDER.map((section) => (
            <div key={section.key} className="card p-5">
              <h3 className="font-semibold text-sm mb-4">{section.icon} {section.label}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {FIELD_DEFS[section.key].map((field) => {
                  const value = config?.[field.key];
                  return (
                    <label key={field.key} className="flex flex-col gap-2 rounded-2xl border border-gray-100 p-3 bg-gray-50/70">
                      <span className="text-sm font-medium text-gray-700">{field.label}</span>
                      {field.type === "toggle" ? (
                        <button
                          type="button"
                          onClick={() => updateField(field.key, !value)}
                          className={`inline-flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold ${value ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-700"}`}
                        >
                          <span>{value ? "Aktiv" : "Deaktiv"}</span>
                          {value ? <Icon name="check" size={14} className="text-emerald-600" /> : <span className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block" />}
                        </button>
                      ) : field.type === "select" ? (
                        <select
                          value={value || ""}
                          onChange={(e) => updateField(field.key, e.target.value)}
                          className="rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white"
                        >
                          {field.options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          value={value || ""}
                          onChange={(e) => updateField(field.key, e.target.value)}
                          className="rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white"
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
