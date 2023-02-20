export const localizedText = (object: any, slug: string, locale = 'fr'): string => {
    if (!object || !object.locales)
		return "";
	if (object.locales[locale])
		return object.locales[locale][slug]
	else if (object.locales[object.default_locale])
		return object.locales[object.default_locale][slug]
	return ""
}