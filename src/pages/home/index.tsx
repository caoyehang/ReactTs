import { useAppTranslation } from "@/locales";

const index = () => {
  const { t } = useAppTranslation();

  return (
    <div className="text-red-500 text-xl font-bold">
      {t("router.root.home")}
    </div>
  );
};

export default index;
