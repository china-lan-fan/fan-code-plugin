# fan 语言 VS Code 插件

[凡语言（fan）](https://china-lan-fan.github.io/) 的 Visual Studio Code 支持插件。

## 功能

- 语法高亮：中文关键字、中文/符号运算符、类型、内置函数、字符串、数字、注释
- 代码片段：条件、循环、函数、模型、方法、错误处理、模块导入等常用结构
- 括号 / 引号自动闭合与配对
- `#` 注释切换（Ctrl+/）
- 基于缩进与 `结束` 的代码折叠
- 一键运行当前 `.fan` 脚本（编辑器右上角运行按钮，或命令面板执行 `fan: 运行当前脚本`）
- 启动交互式 REPL（命令面板执行 `fan: 启动交互式 REPL`）

## 前提

运行脚本功能需要先安装 fan 解释器并确保其在 `PATH` 中可用：

```sh
fan version
```

安装方式见官方文档：https://china-lan-fan.github.io/guide/

## 扩展设置

| 设置项 | 说明 | 默认值 |
|---|---|---|
| `fan.executablePath` | fan 解释器路径 | `fan` |
| `fan.runInTerminal` | 是否在集成终端运行 | `true` |
| `fan.clearBeforeRun` | 运行前是否清空终端 | `false` |

## 开发

```sh
pnpm install
pnpm typecheck   # 类型检查
pnpm build       # 编译到 out/
```

在 VS Code 中按 F5 启动扩展开发宿主调试。

打包：

```sh
pnpm package
```

## 许可证

MIT
