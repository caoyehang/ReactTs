import { useAppTranslation } from "@/locales";

const index = () => {
  const { t } = useAppTranslation();

  return <div>{t("router.root.notFound")}</div>;
};

export default index;
