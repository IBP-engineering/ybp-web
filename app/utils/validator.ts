import * as v from 'valibot'

export const emailValidator = v.pipe(
  v.string(),
  v.trim(),
  v.email('Format email tidak valid'),
  v.nonEmpty('Mohon masukkan email anda'),
)

export const usernameValidator = v.pipe(
  v.string(),
  v.minLength(3, 'Minimal 3 karakter'),
  v.maxLength(16, 'Maksimal 16 karakter'),
  v.regex(
    /^[a-zA-Z0-9._-]+$/,
    'Username hanya boleh mengandung huruf (a-z, A-Z), angka (0-9), titik (.), garis bawah (_), dan tanda hubung (-)',
  ),
  v.trim(),
  v.nonEmpty('Mohon masukkan username anda'),
)

export const passwordValidator = v.pipe(
  v.string(),
  v.minLength(8, 'Minimal 8 karakter'),
  v.trim(),
  v.nonEmpty('Mohon masukkan password anda'),
)

export const optionalPasswordValidator = v.pipe(
  v.optional(v.string(), ''),
  v.trim(),
  v.check(input => input === '' || input.length >= 8, 'Minimal 8 karakter'),
)
