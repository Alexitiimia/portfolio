/** Data de nascimento no formato `AAAA-MM-DD`. */
export type IsoDate = `${number}-${number}-${number}`

/** Idade em anos completos em `today`: só aumenta no dia do aniversário. */
export function ageOn(birthDate: IsoDate, today: Date): number {
  const [year, month, day] = birthDate.split('-').map(Number)
  if (year === undefined || month === undefined || day === undefined) {
    throw new Error(`Data de nascimento inválida: ${birthDate}`)
  }

  const hadBirthday =
    today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day)
  return today.getFullYear() - year - (hadBirthday ? 0 : 1)
}
