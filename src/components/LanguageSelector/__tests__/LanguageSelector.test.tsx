import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../../test/test-utils'
import userEvent from '@testing-library/user-event'
import { LanguageSelector } from '..'

const mockChangeLanguage = vi.fn()

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'pt-BR',
      changeLanguage: mockChangeLanguage,
    },
  }),
}))

describe('LanguageSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with current language', () => {
    render(<LanguageSelector />)
    
    expect(screen.getByText('🇧🇷')).toBeInTheDocument()
    expect(screen.getByText('Português')).toBeInTheDocument()
  })

  it('shows language options when clicked', async () => {
    render(<LanguageSelector />)
    
    const trigger = screen.getByRole('button')
    await userEvent.click(trigger)
    
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('🇺🇸')).toBeInTheDocument()
  })

  it('changes language when option is selected', async () => {
    render(<LanguageSelector />)
    
    const trigger = screen.getByRole('button')
    await userEvent.click(trigger)
    
    const englishOption = screen.getByText('English')
    await userEvent.click(englishOption)
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('en-US')
  })

  it('shows English as current language', () => {
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        i18n: {
          language: 'en-US',
          changeLanguage: mockChangeLanguage,
        },
      }),
    }))

    render(<LanguageSelector />)
    
    expect(screen.getByText('🇺🇸')).toBeInTheDocument()
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  it('closes dropdown after language selection', async () => {
    render(<LanguageSelector />)
    
    const trigger = screen.getByRole('button')
    await userEvent.click(trigger)
    
    const englishOption = screen.getByText('English')
    await userEvent.click(englishOption)
    
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  it('handles unknown language by defaulting to Portuguese', () => {
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        i18n: {
          language: 'unknown',
          changeLanguage: mockChangeLanguage,
        },
      }),
    }))

    render(<LanguageSelector />)
    
    expect(screen.getByText('🇧🇷')).toBeInTheDocument()
    expect(screen.getByText('Português')).toBeInTheDocument()
  })
}) 