import { useAppTranslation } from "@/locales";
import { Layout } from "antd";

const { Footer } = Layout;
const AppFooter = () => {
  const { t } = useAppTranslation();

  return <Footer>{t("layout.footerText")}</Footer>;
};

export default AppFooter;
