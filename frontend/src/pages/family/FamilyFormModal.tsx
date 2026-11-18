import { useState } from 'react'
import type { FormEvent } from 'react'
import Modal from '../../components/ui/Modal'
import Field from '../../components/ui/Field'
import { inputClass, btnPrimary, btnSecondary } from '../../components/ui/styles'
import type { Family } from './familyData'

interface Props {
  initial?: Family
  onSave: (data: { name: string; address: string }) => void
  onClose: () => void
}

export default function FamilyFormModal({ initial, onSave, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [address, setAddress] = useState(initial?.address ?? '')
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Vui lòng nhập tên gia đình.')
      return
    }
    onSave({ name: name.trim(), address: address.trim() })
  }

  return (
    <Modal title={initial ? 'Sửa gia đình' : 'Thêm gia đình'} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field label="Tên gia đình" htmlFor="family-name" error={error}>
          <input
            id="family-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!error}
            aria-describedby="family-name-error"
            placeholder="Ví dụ: Gia đình ông Lê Văn A"
            className={inputClass}
          />
        </Field>
        <Field label="Nơi ở" htmlFor="family-address">
          <input
            id="family-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ví dụ: Hà Nội"
            className={inputClass}
          />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={btnSecondary}>Hủy</button>
          <button type="submit" className={btnPrimary}>{initial ? 'Lưu thay đổi' : 'Thêm gia đình'}</button>
        </div>
      </form>
    </Modal>
  )
}
