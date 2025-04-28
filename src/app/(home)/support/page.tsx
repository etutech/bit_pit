import AppPage from "@/components/AppPage"
import StarRating from "@/components/ui/StarRating"
import { cn } from "@/lib/utils"
import { unauthorized } from "next/navigation"

const SupportPage = () => {
  if (0) unauthorized()
  const bgClasses =
    cn("flex flex-col mb-8 text-xl text-base-content px-8 py-4 text-justify bg-base-100 rounded-3xl")

  return (
    <AppPage title="Support" style={{ backgroundColor: 'var(--color-base-200)' }} className="p-8" loading>
      <div className="prose prose-xl mx-auto">
        <h2 className="text-primary mt-0">支持与帮助</h2>

        <div className={bgClasses}>
          <p>
            走亚食视呀党阿体敢征时卡定怪娘深！场苦波发今！器封永已修活底伴查全块尼亚界窗雷诉。
            写层会狗族前吉。明否士工纪曲式令岁标！转未舞光枪封产必忽发南。场餐秘期良！室奶石导苏圣克纸维那鞋春娘星片！
            命司倒两异非式伙发旅哥人级林味够？便先专喜千委胜产介早钟也毛跟秋质灯元？
          </p>
          <span>
            <StarRating score={5} tipPrefix="评分: " />
          </span>
          <p>权场念沙力简那牙烈！值较烧速吸投征！导失忆印每。头始员迹要惊森海午波识放！
            千势宝改营型还感。諣价温开弄值沉睛项电？温高生花万我位禁付父斯酒姐相蜖沙太部亲？
            缺度背红明祖亲诗深编探速微鸟烟恋在！存腿香古？</p>
        </div>

        <div className={bgClasses}>
          <p>
            走亚食视呀党阿体敢征时卡定怪娘深！场苦波发今！器封永已修活底伴查全块尼亚界窗雷诉。
            写层会狗族前吉。明否士工纪曲式令岁标！转未舞光枪封产必忽发南。场餐秘期良！室奶石导苏圣克纸维那鞋春娘星片！
            命司倒两异非式伙发旅哥人级林味够？便先专喜千委胜产介早钟也毛跟秋质灯元？
          </p>
          <p>权场念沙力简那牙烈！值较烧速吸投征！导失忆印每。头始员迹要惊森海午波识放！
            千势宝改营型还感。諣价温开弄值沉睛项电？温高生花万我位禁付父斯酒姐相蜖沙太部亲？
            缺度背红明祖亲诗深编探速微鸟烟恋在！存腿香古？</p>
        </div>
        <div className={bgClasses}>
          <p>
            走亚食视呀党阿体敢征时卡定怪娘深！场苦波发今！器封永已修活底伴查全块尼亚界窗雷诉。
          </p>
        </div>
      </div>
    </AppPage>
  )
}

export default SupportPage
