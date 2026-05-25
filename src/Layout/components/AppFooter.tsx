import { I18N_NAMESPACE, useAppTranslation } from "@/locales";
import { Layout } from "antd";

const { Footer } = Layout;
const AppFooter = () => {
  const { t } = useAppTranslation(I18N_NAMESPACE.LAYOUT);

  return <Footer>{t("footerText")}</Footer>;
};

export default AppFooter;
