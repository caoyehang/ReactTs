import { I18N_NAMESPACE, useAppTranslation } from "@/locales";

const index = () => {
  const { t } = useAppTranslation(I18N_NAMESPACE.ROUTES_MEMBER);

  return <div>{t("memberInfo")}</div>;
};

export default index;
