import { I18N_NAMESPACE, useAppTranslation } from "@/locales";

const index = () => {
  const { t } = useAppTranslation(I18N_NAMESPACE.ROUTES_ROOT);

  return <div>{t("notFound")}</div>;
};

export default index;
