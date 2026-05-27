import { useAppTranslation } from "@/locales";

const index = () => {
  const { t } = useAppTranslation();

  return <div>{t("router.member.memberInfo")}</div>;
};

export default index;
