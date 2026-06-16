// 引入业务翻译 Hook。
import { useAppTranslation } from "@/locales";

// 定义会员分组页面组件。
const MemberGroupPage = () => {
  // 获取翻译函数。
  const { t } = useAppTranslation();

  // 渲染会员分组标题。
  return <div>{t("router.member.memberGroup")}</div>;
};

// 默认导出会员分组页面。
export default MemberGroupPage;
