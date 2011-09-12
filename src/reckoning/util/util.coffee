define ->
  uuid: () ->
    chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    uuid = new Array(36)
    random = 0

    for digit in [0..36]
      switch digit
        when 8, 13, 18, 23
          uuid[digit] = '-'
        when 14
          uuid[digit] = '4'
        else
          random = 0x2000000 + (Math.random() * 0x1000000) | 0 if (random <= 0x02)
          r = random & 0xf
          random = random >> 4
          uuid[digit] = chars[if digit == 19 then (r & 0x3) | 0x8 else r]

    uuid.join('')
