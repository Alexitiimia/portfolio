import { computeAccessibleName } from 'dom-accessibility-api'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('como o nome acessível é calculado', () => {
  it('variantes', () => {
    render(
      <>
        <a href="#a" id="v1">GitHub<span className="sr">(abre em nova aba)</span></a>
        <a href="#a" id="v2">GitHub <span className="sr">(abre em nova aba)</span></a>
        <a href="#a" id="v3">GitHub<span className="sr">{'(abre em nova aba)'}</span></a>
        <a href="#a" id="v4"><span>GitHub</span><span>(abre em nova aba)</span></a>
        <a href="#a" id="v5" aria-label="GitHub (abre em nova aba)"><span aria-hidden="true">GitHub</span>↗</a>
      </>,
    )
    for (const id of ['v1', 'v2', 'v3', 'v4', 'v5']) {
      const el = document.getElementById(id)
      if (el) console.log(id, JSON.stringify(computeAccessibleName(el)))
    }
    expect(document.querySelectorAll('a')).toHaveLength(5)
  })
})
