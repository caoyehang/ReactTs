// 引入业务翻译 Hook。
import { useAppTranslation } from "@/locales";

// 定义 404 页面组件。
const NotFoundPage = () => {
  // 获取翻译函数。
  const { t } = useAppTranslation();

  // 渲染 404 文案。
  return <div>{t("router.root.notFound")}</div>;
};

// 默认导出 404 页面。
export default NotFoundPage;
