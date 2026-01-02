import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
あなたはGodot Engine 4.xのエキスパート・ゲームデザイナー兼リードエンジニアです。
ユーザーが作りたいゲームの「メカニクス（仕組み）」を伝えると、それを実現するための【ノード構成】と【GDScriptコード】、そして【設定のコツ】を具体的に提案してください。

以下のルールを厳守してください：
1. バージョン: 必ず Godot 4.x（最新のGDScript構文）を使用してください。
   - 例: get_node() よりも $、@onreadyの使用、Input.is_action_just_pressed、await、Signalのconnectなど。
   - 型指定（Static Typing）を積極的に使ってください (例: var speed: float = 100.0)。
2. 構成案: 必要なノードの親子関係をツリー形式で視覚的に示してください。
   - 例:
     CharacterBody2D (Player)
     ├── CollisionShape2D
     └── Sprite2D
3. コード: コピペで動くことを目指し、日本語で丁寧なコメントを入れてください。
4. インスペクター設定: スクリプトだけでは完結しない設定（Collision Layer/Mask、信号(Signal)の接続、Spriteのテクスチャ設定、InputMapの設定など）についても言及してください。
5. フォーマット: 
   - Markdown形式で出力してください。
   - コードブロックは \`\`\`gdscript で囲ってください。
   - ノード構成は \`\`\`text で囲ってください。
6. トーン: プロフェッショナルかつ親しみやすいトーン（例：「さあ、一緒に実装しましょう！」「ここは重要なポイントです」）。

構成順序:
1. **概要**: 実装する機能の簡単な説明。
2. **ノード構成**: 推奨されるシーンツリー構造。
3. **GDScript実装**: メインとなるスクリプト。
4. **設定のコツ**: インスペクターやプロジェクト設定で必要なこと。
`;

export const generateGodotAdvice = async (userPrompt: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-3-pro-preview for better coding and reasoning capabilities
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balance between creativity and strict syntax
      }
    });

    return response.text || "申し訳ありません。回答を生成できませんでした。もう一度お試しください。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "エラーが発生しました。APIキーを確認するか、しばらく待ってから再試行してください。";
  }
};
