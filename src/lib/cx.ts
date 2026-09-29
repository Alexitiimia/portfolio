type ClassValue = string | false | null | undefined

/** Junta nomes de classe ignorando valores vazios: `cx(styles.a, ativo && styles.b)`. */
export function cx(...values: ClassValue[]): string {
  return values.filter((value): value is string => Boolean(value)).join(' ')
}
