// 引入业务翻译 Hook。
import { useAppTranslation } from "@/locales";
// 引入 antd 布局组件。
import { Layout } from "antd";

// 从 antd Layout 中取出 Footer 组件。
const { Footer } = Layout;

// 定义应用底部栏组件。
const AppFooter = () => {
  // 获取翻译函数。
  const { t } = useAppTranslation();

  // 渲染底部文案。
  return <Footer>{t("layout.footerText")}</Footer>;
};

// 默认导出底部栏组件。
export default AppFooter;
