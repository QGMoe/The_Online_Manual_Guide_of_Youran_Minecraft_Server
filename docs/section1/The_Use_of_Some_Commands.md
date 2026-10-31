# 一些指令的使用

在开始游玩我们服务器之前，你务必得学会一些服务器常用的指令。

## /ta - 玩家间互相传送

#### 作用

使用该指令，可以让你传送到<font color="red">同纬度</font>任意一个其他玩家所处的位置（需对方同意）

#### 格式

- `/ta help` ——显示指令帮助
- `/ta <玩家名>` ——向指定玩家发送传送请求
- `/ta <ok|accept|yes>`——同意对方的传送请求
- `/ta <no|deny>` ——拒绝对方的传送请求
- `/ta allow all` ——允许所有传送请求
- `/ta deny all`——拒绝所有传送请求
- `/ok` ——同/ta ok，同意对方的传送请求
- `/ta` ——对方同意请求后，传送至对方的位置

#### 详细用法

如果你要传送至某个玩家，<font color="red">首先你需要输入/ta <玩家名></font>。比如你要传送至玩家“A_Player”，你就需要输入：

`/ta A_Player`

正常来说，游戏会提示你：<font color="#FFC300">A_Player</font> has been asked if you may teleport there.

（你向A_Player询问是否可以传送到他那边）

对方则会收到消息：<font color="#FFC300">XXX</font> is asking permission to teleport to you.

（XXX 正请求传送到你这儿）

然后你就要等待对方同意你的传送请求，即对方执行`/ta ok`、`/ta accept`、`/ta yes`或`/ok`。需要注意：<font color="red">传送请求会在100秒后过时。</font>

对方同意你的传送请求之后，你将会收到一条消息：“Teleport ask has been accepted by A_Player. (100.0s)

Try /ta now. *（传送请求已被A_Player接受，有效期100秒。尝试运行/ta吧！）*”。对方同样也会收到一条消息：“You have <font color="red">accepted</font> <font color="#FFC300">XXX</font> asking to teleport to you. (100.0s)  _（您已同意XXX的传送请求，有效期100秒）_”

<p><font color="red">此时你只需要运行执行<code>/ta</code>，后面不需要加任何东西</font>，就可以传送至对方的位置。</p>

#### 注意事项

<p>该指令有一个bug：无法跨纬度传送玩家。<font color="red">如果你传送至处于另一个维度的玩家，你将会被卡在虚空中，需要重进服务器才能解决问题！</font></p>

#### 其他信息
指令执行需要操作权限：0（所有人）

指令所属模组：Spawn Commands Teleport（传送指令）（[MC百科传送门](https://www.mcmod.cn/class/1157.html)）

## /youran - 一串神奇的指令
#### 作用

一堆作用，详见下面的内容。

#### 格式

- `/youran about` —— 关于悠然服务器
- `/youran back` —— 从主城维度返回主世界
- `/youran help` —— 显示指令帮助信息
- `/youran maincity` —— 传送至主城（简写指令：`/hub`）
- `/youran saveD` —— 快速给所有D级人员回血
- `/youran serverhelp` —— 前往服务器网页手册（就是获得这里的网址）
- `/youran temperature` —— 获取所处地目前的温度
- `/youran tp` —— 传送至一些地方
- `/youran tp help` —— 显示Youran TP帮助
- `/youran tp list` —— 显示传送点列表
- `/youran tp <传送点名称>` ——传送至指定传送点
- `/youran website` —— 前往服务器官网

#### 详细用法

**<font color="#FF33EA ">如果你要传送至主城</font>**，需要执行`/youran maincity`或`/hub`（这是个简写指令，可以更快速传送到主城），然后就可以将你传送至主城大厅。

**<font color="#FF33EA ">如果你要传送至一些指定的传送点</font>**，需要先执行`/youran tp list`获得所有传送点列表，然后再`/youran tp <传送点名称>`传送至指定传送点。

**<font color="#FF33EA ">如果你要获得服务器的帮助</font>**，你可以执行`/youran about`获得服务器信息，也可以`/youran website`前往服务器官网，当然`/youran serverhelp`绝对是最快捷的方式。

**<font color="#FF33EA ">如果你身处主城想要回到主世界</font>**，执行`/youran back`即可。

至于其他的一些指令，就不那么重要，这里就不一一说明（~~而且这些都简单到没必要说明~~）。

#### 其他信息
（除`/youran saveD`以外）指令执行需要操作权限：0（所有人）

`/youran saveD`执行需要操作权限：2（管理员）

指令所属模组：悠然服务器（Youran Mod）

## /home 与 /sethome - 快速返回你的家
#### 作用

使用/home与/sethome，可以设置你家的位置（如果没设置则默认为床的位置），并可以在需要的时候快速返回家。

#### 格式

- `/sethome` —— 将家设置为你当前所在的位置
- `/home` —— 快速回家（如果没有家则回到床的位置）

#### 详细用法

上面已经够详细了。

#### 其他信息

指令执行需要操作权限：0（所有人）

指令所属模组：Spawn Commands Teleport（传送指令）（[MC百科传送门](https://www.mcmod.cn/class/1157.html)）

## /back - 快速返回原有的位置
#### 作用

如果你死了，此条指令可以快速将你送回你死亡的地点，防止装备刷没。如果你传送回家或使用/ta传送到其他玩家的位置，使用此条指令也可以快速把你送回你原来的位置继续干你想要干的事情。

#### 格式

- `/back`

#### 详细用法

上面已经够详细了。

#### 其他信息

指令执行需要操作权限：0（所有人）

指令所属模组：Spawn Commands Teleport（传送指令）（[MC百科传送门](https://www.mcmod.cn/class/1157.html)）
