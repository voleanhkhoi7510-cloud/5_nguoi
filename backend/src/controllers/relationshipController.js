 const mockRelationships = [
  { personA_id: 1, personB_id: 2, relation_type: 'CHA_CON' },
  { personA_id: 2, personB_id: 3, relation_type: 'ANH_EM' },
];

const getRelationship = async (req, res) => {
  try {
    const { personA_id, personB_id } = req.query;

    if (!personA_id || !personB_id) {
      return res.status(400).json({ 
        message: 'Vui lòng cung cấp ID của 2 thành viên (personA_id và personB_id)!' 
      });
    }

    if (personA_id === personB_id) {
      return res.status(400).json({ 
        message: 'ID hai thành viên không được trùng nhau!' 
      });
    }

   
    const result = mockRelationships.find(
      r => (r.personA_id == personA_id && r.personB_id == personB_id) ||
           (r.personA_id == personB_id && r.personB_id == personA_id)
    );

    if (!result) {
      return res.status(404).json({ 
        message: 'Chưa tìm thấy mối quan hệ trực tiếp giữa 2 thành viên này.' 
      });
    }

    return res.status(200).json({
      message: 'Truy vấn mối quan hệ thành công!',
      data: result
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = { getRelationship };