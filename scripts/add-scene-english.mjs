import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const CONTENT_DIR = join(import.meta.dirname, '..', 'content');

// Hardcoded translation map: Chinese text -> English translation
// for all scene and action items across chapters 1-20
const translations = {
  // ── Chapter 1 ──
  "走廊。开学第一天。": "A hallway. First day of school.",
  "小李在看手机，走路。王崩也在看手机，走路。两个人撞到了。小李的包掉了，东西散了一地。": "小李 walks while staring at her phone. 王崩 walks while staring at his phone. They collide. 小李's bag drops, stuff scatters everywhere.",
  "矮中跑过来了。": "矮中 runs over.",
  "矮中蹲下来捡东西。拿起电子烟，看了半天。": "矮中 crouches to pick things up. Grabs the vape, stares at it.",
  "小李戴上耳机走了。": "小李 puts on headphones and walks away.",
  "教室。小黑已经坐好了，在拍奶茶的照片。清清坐在最前面。": "Classroom. 小黑 is already seated, photographing her boba. 清清 sits in the front row.",
  "怪老师进来了。白人。四十多岁。笑容满面。": "怪老师 enters. White. Forties. Beaming smile.",
  "他看了一眼刚走进来的小李。": "He glances at 小李, who just walked in.",
  "小李没抬头，在看手机。": "小李 doesn't look up. Eyes on phone.",
  "他看了小李比较久。清清注意到了。": "He looks at 小李 a beat too long. 清清 notices.",
  "第一课 完": "End of Chapter 1.",

  // ── Chapter 2 ──
  "对话：教室 (Classroom)": "Dialogue: Classroom.",
  "怪老师没话了。": "怪老师 has nothing to say.",
  "1. 有/没有 — to have / to not have": "1. 有/没有 -- to have / to not have",
  "2. 几 vs 多少 — how many?": "2. 几 vs 多少 -- how many?",
  "3. 的 — possession / description": "3. 的 -- possession / description",
  "4. 又...了 — \"again\"": "4. 又...了 -- \"again\"",
  "中国的家庭": "Chinese Families",
  "网红文化": "Influencer Culture",

  // ── Chapter 3 ──
  "对话一：怪老师的群聊 (Guai Laoshi's Group Chat)": "Dialogue 1: 怪老师's Group Chat.",
  "怪老师创建了群聊 \"中文课 📚\"": "怪老师 creates a group chat: \"Chinese Class 📚\"",
  "怪老师加了王崩、矮中、小黑、小李、清清": "怪老师 adds 王崩, 矮中, 小黑, 小李, 清清.",
  "对话二：男生群聊 \"兄弟们 Bros\"": "Dialogue 2: Boys' Group Chat \"兄弟们 Bros\"",
  "矮中创建了 \"兄弟们\"": "矮中 creates \"兄弟们\".",
  "矮中加了王崩": "矮中 adds 王崩.",
  "对话三：女生群聊 \"姐妹们 🙅‍♂️\"": "Dialogue 3: Girls' Group Chat \"姐妹们 🙅\u200d♂️\"",
  "小黑创建了 \"姐妹们 🙅‍♂️\"": "小黑 creates \"姐妹们 🙅\u200d♂️\".",
  "小黑加了小李、清清": "小黑 adds 小李, 清清.",
  "1. 时间表达 (Time Expressions)": "1. Time Expressions",
  "2. 了 as \"already\"": "2. 了 as \"already\"",
  "十一点了。= It's already 11 o'clock.": "十一点了 = It's already 11 o'clock.",
  "你已经说了三次了。= You've already said it three times.": "你已经说了三次了 = You've already said it three times.",
  "3. 别 + verb (negative command)": "3. 别 + verb (negative command)",
  "4. 动词 + 着 (ongoing state)": "4. 动词 + 着 (ongoing state)",
  "微信群": "WeChat Groups",
  "已读不回 = Ghosted": "已读不回 = Ghosted",

  // ── Chapter 4 ──
  "对话：教室 (Classroom)": "Dialogue: Classroom.",
  "矮中没听出来被骂了。怪老师听出来了，赶紧翻页。": "矮中 doesn't realize he just got roasted. 怪老师 does -- quickly flips the page.",
  "1. 会 — can / know how to": "1. 会 -- can / know how to",
  "2. 喜欢 + verb": "2. 喜欢 + verb",
  "3. 正在 + verb — in progress": "3. 正在 + verb -- in progress",
  "4. 太...了 — too / so": "4. 太...了 -- too / so",
  "撩 (liáo) = The Chinese Art of Rizz": "撩 (liáo) = The Chinese Art of Rizz",
  "外卖文化": "Delivery Culture",

  // ── Chapter 5 ──
  "对话一：下课以后 (After Class)": "Dialogue 1: After class.",
  "第一次学生们自愿一起出去。小黑提议喝奶茶。王崩竟然答应了。大家就跟着来了。": "First time the students go out together voluntarily. 小黑 suggests boba. 王崩 actually agrees. Everyone follows.",
  "对话二：面馆里 (At the Noodle Shop)": "Dialogue 2: At the noodle shop.",
  "大家坐下了。矮中点了最辣的。王崩点了牛肉面，马上说台北的牛肉面比较好。小黑点了清淡的因为她在\"减肥\"。清清点了营养均衡的一套。小李迟到了十分钟，手上拿着已经点好的外卖。": "Everyone sits down. 矮中 orders the spiciest option. 王崩 orders beef noodles, immediately says Taipei's are better. 小黑 orders something light because she's \"dieting.\" 清清 orders a balanced set meal. 小李 arrives ten minutes late, takeout already in hand.",
  "矮中的面来了。他吃了一口。脸马上红了。": "矮中's noodles arrive. He takes one bite. Face goes red instantly.",
  "大家笑了。清清也笑了。连王崩都笑了一点。": "Everyone laughs. 清清 laughs too. Even 王崩 cracks a small smile.",
  "清清看着自己的碗。耳朵红了。除了小李没人注意到。": "清清 stares into her bowl. Ears red. Nobody notices except 小李.",
  "对话三：买奶茶 (Buying Bubble Tea)": "Dialogue 3: Buying bubble tea.",
  "1. 想 vs 要 — want": "1. 想 vs 要 -- want",
  "2. 还是 — or (in questions)": "2. 还是 -- or (in questions)",
  "3. 有一点 vs 一点 — \"a little\"": "3. 有一点 vs 一点 -- \"a little\"",
  "4. 得 — complement of degree": "4. 得 -- complement of degree",
  "点奶茶 — How to Order Bubble Tea": "Ordering Bubble Tea -- How to Order",
  "中国的辣": "Chinese Spice Levels",
  "四川辣、湖南辣、贵州辣——各种各样的辣。中国人经常问\"你能吃辣吗？\"如果你是外国人说\"我能吃辣\"，他们会很impressed。如果你真的不能，别逞强。矮中逞强了。": "Sichuan spicy, Hunan spicy, Guizhou spicy -- every kind of heat. Chinese people always ask \"Can you handle spicy?\" If you're a foreigner and say yes, they're impressed. If you actually can't, don't fake it. 矮中 faked it.",

  // ── Chapter 6 ──
  "对话一：群聊 — 早上 (Group Chat — Morning)": "Dialogue 1: Group Chat -- Morning.",
  "对话二：教室——怪老师讲天气 (Classroom — Weather Lesson)": "Dialogue 2: Classroom -- Weather Lesson.",
  "1. 比 — comparison": "1. 比 -- comparison",
  "2. 死了 as intensifier": "2. 死了 as intensifier",
  "3. 得 (complement of manner)": "3. 得 (complement of manner)",
  "4. 应该 — should": "4. 应该 -- should",
  "中国的审美标准": "Chinese Beauty Standards",
  "老师评论学生穿着？": "A teacher commenting on how students dress?",
  "在中国，老师评论学生的穿着不是那么unusual。但怪老师的评论比较……specific。他不是在教词汇。他在看。清清和小黑注意到了。小李没注意到。": "In China, teachers commenting on students' clothes isn't that unusual. But 怪老师's comments are a bit... specific. He's not teaching vocabulary. He's looking. 清清 and 小黑 notice. 小李 doesn't.",

  // ── Chapter 7 ──
  "对话一：考试以后 (After a Test)": "Dialogue 1: After a test.",
  "王崩凑过来看。表情变了。": "王崩 leans in to look. His expression changes.",
  "卧槽 first appearance in the book.": "First appearance of 卧槽 in the book.",
  "对话二：男生群聊 (Boys' Chat — That Night)": "Dialogue 2: Boys' Chat -- That Night.",

  // ── Chapter 8 ──
  "这一章以矮中的日记形式呈现。他用中文写日记作为作业。中文很差，但在进步。": "This chapter is presented as 矮中's diary. He writes in Chinese for homework. His Chinese is bad, but improving.",
  "矮中的日记 — 第247天": "矮中's Diary -- Day 247.",
  "然后去健身房。做了chest和arms。旁边有一个中国女生在跑步。我跟她说了\"你好\"。她没理我。也许她戴耳机了。也许她不想跟我说话。无所谓。这就是numbers game。": "Then hit the gym. Did chest and arms. A Chinese girl was running on the treadmill next to me. Said \"ni hao.\" She ignored me. Maybe she had headphones in. Maybe she didn't want to talk. Whatever. It's a numbers game.",
  "中午吃了学校食堂的饭。食堂的饭真的很便宜。十块钱就能吃饱了。在美国这只够买half a coffee。我给Wang Beng发了自拍。": "Had lunch at the school cafeteria. Cafeteria food is insanely cheap. Ten yuan fills you up. In America that barely buys half a coffee. Sent 王崩 a selfie.",
  "矮中的日记（继续）": "矮中's Diary (continued).",
  "Ch 7: 会/能/可以": "Ch 7: 会/能/可以",
  "Ch 7: 认识 vs 知道": "Ch 7: 认识 vs 知道",
  "Ch 8: 先...再...": "Ch 8: 先...再...",
  "Ch 8: 一边...一边...": "Ch 8: 一边...一边...",
  "Ch 8: 每 (every)": "Ch 8: 每 (every)",
  "中国纹身文化": "Chinese Tattoo Culture",
  "在中国，纹身不像在西方那么普遍。很多人还是觉得有点\"不正经\"。但在年轻人中越来越popular了。纹中文字在外国人中非常流行——但写错的概率很高。矮中不是第一个纹错字的，也不会是最后一个。": "In China, tattoos aren't as common as in the West. Many people still consider them \"disreputable.\" But they're getting more popular among young people. Getting Chinese characters tattooed is hugely popular with foreigners -- but the odds of getting it wrong are high. 矮中 isn't the first to get the wrong character, and he won't be the last.",
  "大学食堂": "University Cafeterias",

  // ── Chapter 9 ──
  "对话一：小黑约王崩 (Xiao Hei Invites Wang Beng)": "Dialogue 1: 小黑 invites 王崩.",
  "她走了。她知道他不会看什么schedule。": "She walks away. She knows he's not going to check any schedule.",
  "对话二：矮中约小李 (Ai Zhong Invites Xiao Li)": "Dialogue 2: 矮中 invites 小李.",
  "对话三：火锅 (The Hot Pot Dinner)": "Dialogue 3: The hot pot dinner.",
  "他们AA了。他送她回宿舍。她说\"谢谢，bye\"就进去了。他站在宿舍楼下面一分钟，觉得自己比几个月来任何时候都矮。": "They split the bill. He walks her back to the dorm. She says \"thanks, bye\" and goes inside. He stands outside the dorm building for a minute, feeling shorter than he has in months.",
  "对话四：女生群聊 — 当晚": "Dialogue 4: Girls' group chat -- that night.",
  "清清放下手机。她应该觉得relieved——小李不感兴趣。但她感受到的不是relief。是更重的东西。他请小李吃饭了。没有请她。": "清清 puts down her phone. She should feel relieved -- 小李 isn't interested. But what she feels isn't relief. It's something heavier. He asked 小李 to dinner. Not her.",

  // ── Chapter 10 ──
  "对话一：篮球场 (Basketball Court)": "Dialogue 1: Basketball court.",
  "他们休息了。坐在bench上。矮中看到了远处的怪老师——在校园咖啡厅附近跟一个年轻中国女生聊天。倾身向前、笑、碰手臂。": "They take a break. Sitting on a bench. 矮中 spots 怪老师 in the distance -- near the campus coffee shop, chatting up a young Chinese girl. Leaning in, laughing, touching her arm.",
  "Ch 9: 想 + verb (want to)": "Ch 9: 想 + verb (want to)",
  "Ch 9: 吧 (suggestion / softener)": "Ch 9: 吧 (suggestion / softener)",
  "Ch 10: 觉得 vs 认为": "Ch 10: 觉得 vs 认为",
  "Ch 10: 虽然...但是...": "Ch 10: 虽然...但是...",
  "AA vs 请客": "Going Dutch vs Treating",
  "Charisma Man现象": "The Charisma Man Phenomenon",
  "在亚洲，一些在自己国家不太受欢迎的西方男性会突然变得\"有魅力\"。因为外国人身份本身就是一个novelty。矮中在Ohio是5分，在中国是7分——他自己说的。但在小李面前（半白半中国），这个bonus消失了。王崩一针见血。": "In Asia, some Western men who aren't popular back home suddenly become \"charming.\" Being foreign is itself a novelty. 矮中 is a 5 in Ohio, a 7 in China -- his own words. But in front of 小李 (half white, half Chinese), that bonus vanishes. 王崩 nailed it.",

  // ── Chapter 11 ──
  "对话一：群聊 (Group Chat)": "Dialogue 1: Group Chat.",
  "周六晚上六点。火锅店。矮中一个人到了。没人来。他看了看空的桌子，耸了耸肩，去了旁边的酒吧。八点的时候，他跟六个刚认识二十分钟的中国大学生坐在一起。他们在给他庆生。有人用餐巾纸给他做了一个皇冠。大家在唱中文生日歌。他的中文很烂，所有人都在笑。他也在笑。": "Saturday, 6 PM. Hot pot restaurant. 矮中 arrives alone. Nobody shows. He looks at the empty table, shrugs, and heads to the bar next door. By 8 PM, he's sitting with six Chinese college students he met twenty minutes ago. They're celebrating his birthday. Someone made him a crown out of napkins. Everyone is singing Happy Birthday in Chinese. His Chinese is terrible and everyone is laughing. He's laughing too.",
  "对话二：群聊反应 (Group Chat Reactions)": "Dialogue 2: Group Chat Reactions.",

  // ── Chapter 12 ──
  "对话一：怪老师的私信升级 (Guai Laoshi's DMs Escalate)": "Dialogue 1: 怪老师's DMs escalate.",
  "女生群聊": "Girls' group chat.",
  "> 怪老师：清清，你的作文写得太好了。你是我教过的最有才华的学生。你有没有想过读研？我可以给你写推荐信。": "> 怪老师: 清清, your essay is so well-written. You're the most talented student I've ever taught. Have you thought about grad school? I could write you a recommendation letter.",
  "对话二：Shopping——女生出去逛街 (Girls Go Shopping)": "Dialogue 2: Shopping -- Girls go out.",
  "她递给清清一件简单的黑色T恤。清清看了一下。穿上了。看了看镜子。": "She hands 清清 a simple black T-shirt. 清清 looks at it. Puts it on. Checks the mirror.",
  "Ch 11: 了 (completed action)": "Ch 11: 了 (completed action)",
  "她打了又删了。= She typed then deleted.": "她打了又删了 = She typed then deleted.",
  "Ch 11: 过 (experience)": "Ch 11: 过 (experience)",
  "Ch 12: 太...了": "Ch 12: 太...了",
  "Ch 12: 跟...一样": "Ch 12: 跟...一样",

  // ── Chapter 13 ──
  "对话一：群聊——矮中的campaign (Group Chat)": "Dialogue 1: Group Chat -- 矮中's campaign.",
  "对话二：Getting Ready — 女生宿舍 (Girls' Dorm)": "Dialogue 2: Getting Ready -- Girls' Dorm.",
  "周五傍晚。小黑化妆化了两个小时。小李躺在床上刷手机。清清在衣柜前面呆住了。": "Friday evening. 小黑 has been doing makeup for two hours. 小李 lies in bed scrolling her phone. 清清 is frozen in front of her closet.",
  "清清穿上了。照镜子。看起来不一样了。不太像课本了。像一个人了。": "清清 puts it on. Checks the mirror. She looks different. Less like a textbook. More like a person.",
  "对话三：男生群聊 (Boys' Chat)": "Dialogue 3: Boys' Chat.",
  "中国的夜店文化": "Chinese Nightlife Culture",

  // ── Chapter 14 ──
  "对话：矮中的宿舍 (Ai Zhong's Dorm Room)": "Dialogue: 矮中's dorm room.",
  "她喝了一口。脸立刻红了。": "She takes a sip. Face goes red instantly.",
  "白酒 (Baijiu)": "Baijiu (Chinese Liquor)",
  "Asian Flush": "Asian Flush",

  // ── Chapter 15 ──
  "那天晚上大家都喝了一点白酒，走路去了学校附近的一家酒吧。音乐很响，灯很暗。矮中买了第一轮酒。王崩站在角落里，手里拿着一杯啤酒，看起来很酷。小黑在王崩附近跳舞——不是跟他跳，但够近了。清清坐在桌子旁边，喝着可乐，看着矮中在人群里走来走去。小李一个人在跳舞。": "That night everyone had some baijiu and walked to a bar near campus. Music loud, lights dim. 矮中 buys the first round. 王崩 stands in the corner holding a beer, looking effortlessly cool. 小黑 dances near 王崩 -- not with him, but close enough. 清清 sits at a table, nursing a Coke, watching 矮中 move through the crowd. 小李 dances alone.",
  "对话一：酒吧里 (At the Bar)": "Dialogue 1: At the bar.",
  "矮中五分钟内已经跟旁边桌的中国女生们聊上了。他买了一轮酒。他的中文很烂但他的energy很有感染力。": "Within five minutes, 矮中 is already chatting up the Chinese girls at the next table. He buys a round. His Chinese is terrible but his energy is infectious.",
  "清清看着她。胸口的什么东西松了。她没有说谢谢。但小李知道。": "清清 looks at her. Something in her chest loosens. She doesn't say thanks. But 小李 knows.",
  "对话二：一个小时以后 (One Hour Later)": "Dialogue 2: One hour later.",
  "矮中三杯酒下去了。他想去跟小李说话。走到她面前。嘴巴张开。什么都说不出来。她在跳舞，根本没看到他站在那里。她从他旁边跳过去了，像他是家具一样。": "矮中 is three drinks in. He wants to talk to 小李. Walks up to her. Opens his mouth. Nothing comes out. She's dancing, doesn't even see him standing there. She dances right past him like he's furniture.",
  "他转过来。小黑在那里。在跳舞。在看他。她喝了两杯了。被王崩ignore了一晚上了。她想要有人——任何人——看她。": "He turns around. 小黑 is there. Dancing. Looking at him. She's two drinks in. 王崩 has ignored her all night. She wants someone -- anyone -- to see her.",
  "她走了。很快。": "She leaves. Fast.",
  "对话三：门外 (Outside the Bar)": "Dialogue 3: Outside the bar.",
  "对话四：酒吧里——矮中和清清 (Inside — Ai Zhong and Qingqing)": "Dialogue 4: Inside the bar -- 矮中 and 清清.",
  "矮中在吧台。刚才的high全没了。": "矮中 at the bar. The buzz is completely gone.",
  "这时候，酒吧那边，怪老师来了。穿着太年轻的衬衫。一个人。跟一个年轻的中国女生聊天。身体前倾。笑。买酒。那个女生看起来politely不舒服。她拿了酒。走了。怪老师转向下一个。": "Meanwhile, across the bar, 怪老师 shows up. Wearing a shirt too young for him. Alone. Chatting up a young Chinese girl. Leaning in. Laughing. Buying drinks. The girl looks politely uncomfortable. She takes the drink. Walks away. 怪老师 moves on to the next one.",
  "怪老师站起来了。那个女生挽着他的手臂。她一直在看他的手表、手腕。他在笑。她也在笑。他们往出口走。": "怪老师 stands up. The girl takes his arm. She keeps glancing at his watch, his wrist. He's smiling. She's smiling. They walk toward the exit.",
  "大家看着他们走了。": "Everyone watches them leave.",
  "Ch 14: 越来越 — more and more": "Ch 14: 越来越 -- more and more",
  "她喝得越来越多了。= She's drinking more and more.": "她喝得越来越多了 = She's drinking more and more.",
  "怪老师的私信越来越过分了。= Guai's DMs are getting more and more excessive.": "怪老师's DMs are getting more and more excessive.",
  "Ch 15: 把 — disposal/result": "Ch 15: 把 -- disposal/result",
  "她把手机放下了。= She put down her phone.": "她把手机放下了 = She put down her phone.",
  "Ch 15: V过 — ever done something": "Ch 15: V过 -- ever done something",

  // ── Chapter 16 ──
  "那天晚上以后，大家都变了一点。矮中亲了小黑——但不是因为喜欢她。小黑的第一次接吻是drunk的、sloppy的、不是给她的。王崩坐在路边陪了她一个小时，把外套给了她。清清听到了矮中说\"我想跟小李说话但说不出来\"。怪老师在酒吧里跟一个年轻女生走了。": "After that night, everyone changed a little. 矮中 kissed 小黑 -- but not because he liked her. 小黑's first kiss was drunk, sloppy, and not meant for her. 王崩 sat on the curb with her for an hour and gave her his jacket. 清清 heard 矮中 say \"I wanted to talk to 小李 but couldn't.\" 怪老师 left the bar with a young girl.",
  "星期天早上。所有人都醒了。所有人都在看手机。": "Sunday morning. Everyone's awake. Everyone's on their phones.",
  "对话一：男生群聊 (Boys' Chat)": "Dialogue 1: Boys' Chat.",
  "对话二：矮中道歉 (Ai Zhong Apologizes — In Person)": "Dialogue 2: 矮中 apologizes -- in person.",
  "她走进教室。矮中跟着进去了。他没注意到清清站在走廊拐角，听到了整段对话。她听到了\"小李\"。她把这条信息存在了一个她以后会独自一个人、很难受的时候去看的地方。": "She walks into the classroom. 矮中 follows. He doesn't notice 清清 standing around the hallway corner, having heard the entire conversation. She heard \"小李.\" She files this information away in a place she'll revisit later, alone, when it hurts.",
  "对话三：上课——线索 (Class — The Clue)": "Dialogue 3: Class -- The Clue.",
  "教室。怪老师在教课。他看起来很累。学生们都知道为什么——他们在酒吧看到他了。但上课的时候谁都没说。": "Classroom. 怪老师 is teaching. He looks exhausted. The students know why -- they saw him at the bar. But nobody says a word in class.",
  "所有人都转过来看。小李从来不举手。而且她的句子……明显比以前好。语法更干净了。声调更准了。": "Everyone turns to look. 小李 never raises her hand. And her sentence... is noticeably better than before. Cleaner grammar. More accurate tones.",
  "清清看着小李。看着怪老师。有什么东西click了。她也把这条信息存了起来。": "清清 looks at 小李. Looks at 怪老师. Something clicks. She files this away too.",

  // ── Chapter 17 ──
  "对话一：图书馆——女生 (Library — Girls)": "Dialogue 1: Library -- Girls.",
  "对话二：食堂——男生 (Cafeteria — Boys)": "Dialogue 2: Cafeteria -- Boys.",
  "Ch 16: 是...的 (emphasizing details of past event)": "Ch 16: 是...的 (emphasizing details of past event)",
  "Ch 17: 如果...就": "Ch 17: 如果...就",
  "Ch 17: 要是...的话 (more colloquial \"if\")": "Ch 17: 要是...的话 (more colloquial \"if\")",
  "Ch 17: 会 (future probability)": "Ch 17: 会 (future probability)",

  // ── Chapter 18 ──
  "对话一：小黑告白王崩 (Xiao Hei Confesses to Wang Beng)": "Dialogue 1: 小黑 confesses to 王崩.",
  "下课以后。小黑跟自己说了一周了：如果他说\"哦谢谢\"，那就说\"哦谢谢\"吧。她活得过来的。absent的爸爸她活下来了。对自己皮肤的不满她活下来了。这只是one more thing。": "After class. 小黑 has been telling herself all week: if he says \"oh thanks,\" then he says \"oh thanks.\" She'll survive. She survived an absent father. She survived hating her own skin. This is just one more thing.",
  "王崩停下来了。": "王崩 stops.",
  "他们走了。很近但没碰到。小黑的心跳快到她能听到。王崩一直看前面，因为他如果看她会失去composure，而王崩从来不失去composure。": "They walk. Close but not touching. 小黑's heartbeat is so loud she can hear it. 王崩 keeps looking straight ahead, because if he looks at her he'll lose his composure, and 王崩 never loses his composure.",
  "对话二：图书馆——矮中和清清 (Library — Ai Zhong and Qingqing)": "Dialogue 2: Library -- 矮中 and 清清.",
  "矮中拿着中文作业来找清清。他自己做的——字歪歪扭扭的，一半是错的，但他做了。": "矮中 brings his Chinese homework to 清清. He did it himself -- characters crooked, half of them wrong, but he did it.",
  "她笑了。真的笑了。清清不笑。清清的表情是tight smile加\"嗯\"。但现在，在图书馆里，她笑了。": "She laughs. Actually laughs. 清清 doesn't laugh. 清清's expression is a tight smile plus \"mm.\" But now, in the library, she laughs.",

  // ── Chapter 19 ──
  "对话一：奶茶店——王崩和小黑 (Boba Shop — Wang Beng and Xiao Hei)": "Dialogue 1: Boba shop -- 王崩 and 小黑.",
  "奶茶店。面对面坐着。王崩点了一杯很复杂的，盯着看，表情狐疑。": "Boba shop. Sitting face to face. 王崩 orders something complicated, stares at it, expression suspicious.",
  "对话二：广东菜——矮中和清清 (Cantonese Food — Ai Zhong and Qingqing)": "Dialogue 2: Cantonese food -- 矮中 and 清清.",
  "这个星期他们每天都在图书馆学习了。一开始是做作业。现在矮中没有作业也来。": "This week they've studied at the library every day. At first it was for homework. Now 矮中 comes even when there's no homework.",
  "餐厅。矮中点菜了——用中文，没看英文菜单。清清看着。他的中文在变好。什么时候的事？": "Restaurant. 矮中 orders -- in Chinese, no English menu. 清清 watches. His Chinese is getting better. When did that happen?",
  "Ch 18: 比 (comparison)": "Ch 18: 比 (comparison)",
  "Ch 18: 从...就 (since...already)": "Ch 18: 从...就 (since...already)",
  "从第一天就喜欢了。= Since the first day I've liked you.": "从第一天就喜欢了 = Since the first day I've liked you.",
  "Ch 19: 试试 (try and see)": "Ch 19: 试试 (try and see)",
  "Ch 19: V起来 (when you start doing...)": "Ch 19: V起来 (when you start doing...)",

  // ── Chapter 20 ──
  "最后一天上课了。教室跟第一天一样的教室。人不一样了。": "Last day of class. Same classroom as day one. Different people.",
  "王崩和小黑一起走进来的。没牵手，但很近。他手上拿着她的奶茶。她身上穿的外套——就是那件，路边那件。她没还。他没要。": "王崩 and 小黑 walk in together. Not holding hands, but close. He's carrying her boba. The jacket she's wearing -- that jacket, the curb jacket. She never returned it. He never asked.",
  "矮中已经坐好了。他在清清旁边放了一本笔记本占座。清清进来的时候看到了，坐下了，什么都没说。他们的肩膀碰着。谁都没让。": "矮中 is already seated. He's put a notebook on the chair next to him to save it. When 清清 comes in, she sees it, sits down, says nothing. Their shoulders touch. Neither moves.",
  "小李最后进来的。所有人都注意到了。她看起来……不一样。眼线淡了。穿了一件浅色的毛衣。没抽电子烟——她已经两周没抽了。手机在包里——在包里面，不是手上。": "小李 comes in last. Everyone notices. She looks... different. Less eyeliner. A light-colored sweater. No vape -- she hasn't vaped in two weeks. Phone is in her bag -- inside the bag, not in her hand.",
  "对话：最后一节课 (The Last Class)": "Dialogue: The Last Class.",
  "王崩转过来了。整个身体转过来了。": "王崩 turns. Entire body turns.",
  "教室里安静了。没有人expect this。": "The classroom goes silent. Nobody expected this.",
  "没有人说话。但所有人看到了。": "Nobody speaks. But everyone sees.",
  "小黑举着手机。矮中挤到中间，笑得最大声，手搭在清清肩膀上——清清脸红但没让开。王崩站得很直，但他的手离小黑的肩膀很近——近但没碰到。小李在最边上，笑了一点，比这学期任何时候都真。怪老师在最后面，没有creepy的笑容了，只有一张累的、honest的脸。": "小黑 holds up her phone. 矮中 squeezes to the center, laughing the loudest, arm around 清清's shoulder -- 清清 blushes but doesn't pull away. 王崩 stands straight, but his hand is close to 小黑's shoulder -- close but not touching. 小李 stands at the edge, smiling a little, more genuine than any moment this semester. 怪老师 in the back, no more creepy grin, just a tired, honest face.",
  "大家走了。笑着，吵着，已经在发消息了。跟第一天走进来的那群人不一样了。": "Everyone leaves. Laughing, bickering, already texting. Not the same people who walked in on day one.",
  "小李是最后走的。在门口，她转过来了。": "小李 is the last to leave. At the door, she turns around.",
  "她走了。他站在空的教室里。手上拿着粉笔。一个人。但跟以前的一个人不一样了。": "She leaves. He stands in the empty classroom. Chalk in hand. Alone. But not the same kind of alone as before.",
  "她看了怪老师一眼。就一秒。他也看了她一秒。清清看到了。她是对的。": "She glances at 怪老师. Just one second. He looks at her for one second too. 清清 sees it. She was right.",
  "谢谢你们": "Thank you all.",
  "全书完 — END OF BOOK": "End of Book.",
  "会 (future/prediction)": "会 (future/prediction)",
  "快...了 (about to / almost)": "快...了 (about to / almost)",
  "学期快结束了。= The semester is almost over.": "学期快结束了 = The semester is almost over.",
  "快走了。= About to leave.": "快走了 = About to leave.",
  "不再 (no longer)": "不再 (no longer)",
  "我不再用美白霜了。= I won't use whitening cream anymore.": "我不再用美白霜了 = I won't use whitening cream anymore.",
  "他不再叫她漂亮了。= He no longer called her pretty.": "他不再叫她漂亮了 = He no longer called her pretty.",
  "越来越 (more and more)": "越来越 (more and more)",
  "她的中文越来越好了。= Her Chinese is getting better and better.": "她的中文越来越好了 = Her Chinese is getting better and better.",
  "他们越来越像朋友了。= They're becoming more and more like friends.": "他们越来越像朋友了 = They're becoming more and more like friends.",
  "繁体字和简体字的bridge": "The Bridge Between Traditional and Simplified Characters",
  "矮中说他要学繁体字。这不只是一个语言选择——这是一个bridge。他在说：我认真了。我尊重你的文化。王崩听懂了。这是全书中他们之间最重要的moment。": "矮中 says he wants to learn traditional characters. This isn't just a language choice -- it's a bridge. He's saying: I'm serious now. I respect your culture. 王崩 understood. This is the most important moment between them in the entire book.",
  "\"谢谢你们\"": "\"Thank you all.\"",
  "小李在黑板上写的\"谢谢你们\"不只是感谢。这是她第一次主动留下什么。一个从来不表达的人，写了三个字。这就够了。": "The \"谢谢你们\" 小李 wrote on the blackboard isn't just gratitude. It's the first time she's ever left something behind on purpose. A person who never expresses anything wrote three characters. That's enough."
};

// Process all 20 chapter files
for (let i = 1; i <= 20; i++) {
  const filename = `ch${String(i).padStart(2, '0')}.json`;
  const filepath = join(CONTENT_DIR, filename);

  let data;
  try {
    data = JSON.parse(readFileSync(filepath, 'utf-8'));
  } catch (e) {
    console.error(`Failed to read ${filename}: ${e.message}`);
    continue;
  }

  let modified = 0;
  let missing = 0;

  for (const item of data.script) {
    if (item.type === 'scene' || item.type === 'action') {
      if (item.en) continue; // already has translation
      const text = item.text;
      if (translations[text]) {
        item.en = translations[text];
        modified++;
      } else {
        console.warn(`[${filename}] MISSING translation for: "${text}"`);
        missing++;
      }
    }
  }

  writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log(`${filename}: ${modified} translated, ${missing} missing`);
}

console.log('\nDone!');
