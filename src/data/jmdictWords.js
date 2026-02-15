/*
 * ═══════════════ JLPT WORD DATA ═══════════════
 * Source: JMdict (EDRDG, CC BY-SA 4.0). JLPT levels approximate.
 * Format: [reading, kanji, english, pos, jlpt_level]
 */
export const JMDICT_DATA = [
// ── N5 Verbs ──
["たべる","食べる","to eat","v1",5],["みる","見る","to see; to watch","v1",5],
["ねる","寝る","to sleep","v1",5],["おきる","起きる","to wake up","v1",5],
["でる","出る","to go out; to exit","v1",5],["いれる","入れる","to put in","v1",5],
["あける","開ける","to open","v1",5],["しめる","閉める","to close","v1",5],
["おしえる","教える","to teach; to tell","v1",5],["つける","つける","to turn on; to attach","v1",5],
["いる","いる","to exist (animate)","v1",5],
["のむ","飲む","to drink","v5m",5],["かく","書く","to write","v5k",5],
["よむ","読む","to read","v5m",5],["きく","聞く","to listen; to ask","v5k",5],
["はなす","話す","to speak; to talk","v5s",5],["いく","行く","to go","v5k",5],
["かう","買う","to buy","v5u",5],["あう","会う","to meet","v5u",5],
["まつ","待つ","to wait","v5t",5],["もつ","持つ","to hold; to have","v5t",5],
["つかう","使う","to use","v5u",5],["つくる","作る","to make","v5r",5],
["わかる","分かる","to understand","v5r",5],["はいる","入る","to enter","v5r",5],
["かえる","帰る","to return home","v5r",5],["あるく","歩く","to walk","v5k",5],
["はしる","走る","to run","v5r",5],["すわる","座る","to sit","v5r",5],
["たつ","立つ","to stand","v5t",5],["ある","ある","to exist (inanimate)","v5r",5],
["する","する","to do","vs",5],["くる","来る","to come","vk",5],
// ── N5 Adjectives ──
["おおきい","大きい","big; large","adj-i",5],["ちいさい","小さい","small","adj-i",5],
["たかい","高い","tall; expensive","adj-i",5],["やすい","安い","cheap","adj-i",5],
["あたらしい","新しい","new","adj-i",5],["ふるい","古い","old (things)","adj-i",5],
["いい","いい","good","adj-ix",5],["わるい","悪い","bad","adj-i",5],
["おもしろい","面白い","interesting; funny","adj-i",5],["あつい","暑い","hot (weather)","adj-i",5],
["さむい","寒い","cold (weather)","adj-i",5],["おいしい","美味しい","delicious","adj-i",5],
["ながい","長い","long","adj-i",5],["みじかい","短い","short","adj-i",5],
["しずか","静か","quiet","adj-na",5],["げんき","元気","energetic; healthy","adj-na",5],
["すき","好き","liked","adj-na",5],["きらい","嫌い","disliked","adj-na",5],
// ── N4 Verbs ──
["おぼえる","覚える","to remember","v1",4],["わすれる","忘れる","to forget","v1",4],
["きめる","決める","to decide","v1",4],["かんがえる","考える","to think; to consider","v1",4],
["こたえる","答える","to answer","v1",4],["つたえる","伝える","to convey","v1",4],
["はじめる","始める","to begin","v1",4],["たすける","助ける","to help; to save","v1",4],
["うたう","歌う","to sing","v5u",4],["おどる","踊る","to dance","v5r",4],
["おくる","送る","to send","v5r",4],["ならう","習う","to learn","v5u",4],
["かえす","返す","to return (something)","v5s",4],["ぬぐ","脱ぐ","to take off (clothes)","v5g",4],
["えらぶ","選ぶ","to choose","v5b",4],["よぶ","呼ぶ","to call","v5b",4],
["うごく","動く","to move","v5k",4],["なおす","直す","to fix; to correct","v5s",4],
["さがす","探す","to search for","v5s",4],["しぬ","死ぬ","to die","v5n",4],
// ── N4 Adjectives ──
["うれしい","嬉しい","happy; glad","adj-i",4],["かなしい","悲しい","sad","adj-i",4],
["つよい","強い","strong","adj-i",4],["よわい","弱い","weak","adj-i",4],
["うつくしい","美しい","beautiful","adj-i",4],["ただしい","正しい","correct","adj-i",4],
["はずかしい","恥ずかしい","embarrassing","adj-i",4],
["ひつよう","必要","necessary","adj-na",4],["たいせつ","大切","important","adj-na",4],
["べんり","便利","convenient","adj-na",4],
// ── N3 Verbs ──
["あきらめる","諦める","to give up","v1",3],["たおれる","倒れる","to collapse","v1",3],
["くらべる","比べる","to compare","v1",3],["みとめる","認める","to acknowledge","v1",3],
["まもる","守る","to protect","v5r",3],["ぬすむ","盗む","to steal","v5m",3],
["つつむ","包む","to wrap","v5m",3],["ことわる","断る","to refuse","v5r",3],
["まよう","迷う","to be lost; to hesitate","v5u",3],["あやまる","謝る","to apologize","v5r",3],
["かわく","乾く","to dry","v5k",3],["ひろう","拾う","to pick up","v5u",3],
["うかぶ","浮かぶ","to float; to come to mind","v5b",3],["かせぐ","稼ぐ","to earn","v5g",3],
// ── N3 Adjectives ──
["くやしい","悔しい","frustrating","adj-i",3],["すばらしい","素晴らしい","wonderful","adj-i",3],
["めずらしい","珍しい","rare; unusual","adj-i",3],["やわらかい","柔らかい","soft","adj-i",3],
["くわしい","詳しい","detailed; knowledgeable","adj-i",3],
["まじめ","真面目","serious; earnest","adj-na",3],["へいわ","平和","peaceful","adj-na",3],
// ── N2 Verbs ──
["あきれる","呆れる","to be shocked","v1",2],["くずれる","崩れる","to crumble","v1",2],
["ささえる","支える","to support","v1",2],["たずねる","訪ねる","to visit","v1",2],
["あふれる","溢れる","to overflow","v1",2],["なやむ","悩む","to worry","v5m",2],
["はげむ","励む","to strive","v5m",2],["つかむ","掴む","to grab; to seize","v5m",2],
["みがく","磨く","to polish; to brush","v5k",2],["おちつく","落ち着く","to calm down","v5k",2],
// ── N2 Adjectives ──
["おそろしい","恐ろしい","frightening","adj-i",2],["なつかしい","懐かしい","nostalgic","adj-i",2],
["したしい","親しい","intimate; close","adj-i",2],
["おだやか","穏やか","calm; gentle","adj-na",2],["けんこう","健康","healthy","adj-na",2],
// ── N1 Verbs ──
["あやつる","操る","to manipulate","v5r",1],["くつがえす","覆す","to overturn","v5s",1],
["たくらむ","企む","to plot","v5m",1],["はばむ","阻む","to obstruct","v5m",1],
["つちかう","培う","to cultivate","v5u",1],["いたわる","労る","to care for","v5r",1],
["くつろぐ","寛ぐ","to relax","v5g",1],["おどす","脅す","to threaten","v5s",1],
// ── N1 Adjectives ──
["いさましい","勇ましい","brave; valiant","adj-i",1],["まぎらわしい","紛らわしい","confusing","adj-i",1],
["あざやか","鮮やか","vivid; brilliant","adj-na",1],["しなやか","しなやか","supple; flexible","adj-na",1],
]