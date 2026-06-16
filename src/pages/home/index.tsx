// 引入业务翻译 Hook。
import { useAppTranslation } from "@/locales";

// 定义首页页面组件。
const HomePage = () => {
  // 获取翻译函数。
  const { t } = useAppTranslation();

  // 渲染首页标题。
  return (
    <div className="text-red-500 text-xl font-bold">
      {t("router.root.home")}
    </div>
  );
};

// 默认导出首页页面。
export default HomePage;
