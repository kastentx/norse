export class PromptEnhancer {
  /**
   * Create a prompt for god portrait generation
   */
  createGodPrompt(
    godName: string,
    domain: string,
    attributes: string[],
    mood: string
  ): string {
    const attributesList = attributes.join(', ');
    
    return `Epic fantasy portrait of ${godName}, Norse god/goddess of ${domain}.

Visual details: ${attributesList}
Mood: ${mood}, powerful, divine presence
Art style: Digital painting, dramatic lighting, mystical atmosphere, cinematic composition
Quality: Masterpiece, highly detailed, 8k resolution
Setting: Norse mythology aesthetic with subtle Nordic patterns and runes

Focus on strong characterization, expressive face, and iconic pose that captures the essence of ${domain}.`;
  }

  /**
   * Create a prompt for story illustration generation
   */
  createStoryPrompt(storyName: string, scene: string, mood: string): string {
    return `Epic Norse mythology illustration depicting: ${scene}

Story: ${storyName}
Mood: ${mood}, legendary, mythic
Art style: Fantasy book illustration, detailed environment, atmospheric perspective
Quality: Masterpiece, highly detailed, epic composition
Setting: Norse mythology world with dramatic sky, ancient Nordic aesthetic

Focus on storytelling, dynamic action, and immersive fantasy atmosphere.`;
  }

  /**
   * Create a prompt for realm landscape generation
   */
  createRealmPrompt(
    realmName: string,
    description: string,
    atmosphere: string
  ): string {
    return `Vast fantasy landscape of ${realmName}, one of the Nine Realms of Norse mythology.

Description: ${description}
Atmosphere: ${atmosphere}
Art style: Epic fantasy environment art, atmospheric perspective, cinematic vista
Quality: Masterpiece, highly detailed, breathtaking composition, 8k resolution
Elements: Norse mythology aesthetic, mystical sky, ancient Nordic architecture

Create an immersive, otherworldly environment that captures the unique character of this realm.`;
  }

  /**
   * Create a prompt for symbol/icon generation
   */
  createSymbolPrompt(
    symbolName: string,
    description: string,
    style: string
  ): string {
    const styleGuide = {
      minimal: 'Clean, iconic, vector-style design with clear silhouette',
      detailed: 'Intricate details, ornate Norse patterns, highly decorated',
      runic: 'Ancient runic aesthetic, carved stone appearance, weathered',
      ornate: 'Elaborate decorative elements, golden accents, royal craftsmanship',
    }[style] || 'Balanced design with clear iconography';

    return `Norse mythology symbol: ${symbolName}

Description: ${description}
Style: ${styleGuide}
Art style: Professional icon design, recognizable silhouette, symbolic representation
Quality: Clean, crisp, scalable vector aesthetic
Format: Centered composition, isolated subject, solid background

Create a powerful, instantly recognizable symbol that embodies Norse mythology.`;
  }

  /**
   * Add negative prompts for better quality control
   */
  getDefaultNegativePrompt(): string {
    return `low quality, blurry, distorted, watermark, text, signature, logo, 
    anime style, cartoon, modern clothing, contemporary elements, 
    poor anatomy, bad proportions, ugly, deformed`;
  }

  /**
   * Enhance a raw prompt with quality modifiers
   */
  enhancePrompt(basePrompt: string): string {
    const qualityModifiers = [
      'masterpiece',
      'highly detailed',
      'professional',
      'cinematic lighting',
      'epic composition',
    ];

    return `${basePrompt}\n\nQuality: ${qualityModifiers.join(', ')}`;
  }
}
