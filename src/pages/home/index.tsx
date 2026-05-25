import { I18N_NAMESPACE, useAppTranslation } from "@/locales";

const index = () => {
  const { t } = useAppTranslation(I18N_NAMESPACE.ROUTES_ROOT);

  return <div className="text-red-500 text-xl font-bold">{t("home")}</div>;
};

export default index;
