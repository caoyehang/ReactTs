import { useAppTranslation } from "@/locales";

const index = () => {
  const { t } = useAppTranslation();

  return <div>{t("router.member.memberGroup")}</div>;
};

export default index;
