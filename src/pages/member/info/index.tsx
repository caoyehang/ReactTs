// 引入业务翻译 Hook。
import { useAppTranslation } from "@/locales";

// 定义会员信息页面组件。
const MemberInfoPage = () => {
  // 获取翻译函数。
  const { t } = useAppTranslation();

  // 渲染会员信息标题。
  return <div>{t("router.member.memberInfo")}</div>;
};

// 默认导出会员信息页面。
export default MemberInfoPage;
