import type { Person, Relationship, FamilyTreeData } from '../types';

function makePerson(
  id: string,
  lastName: string,
  firstName: string,
  gender: Person['gender'],
  generation: number,
  opts: {
    birthDate?: string;
    deathDate?: string;
    isLiving?: boolean;
    occupation?: string;
    hometown?: string;
    notes?: string;
    fatherId?: string;
    motherId?: string;
    spouseIds?: string[];
    childrenIds?: string[];
  } = {}
): Person {
  return {
    id,
    lastName,
    firstName,
    gender,
    generation,
    birthDate: opts.birthDate,
    deathDate: opts.deathDate,
    isLiving: opts.isLiving ?? !opts.deathDate,
    occupation: opts.occupation,
    hometown: opts.hometown,
    notes: opts.notes,
    fatherId: opts.fatherId,
    motherId: opts.motherId,
    spouseIds: opts.spouseIds ?? [],
    childrenIds: opts.childrenIds ?? [],
  };
}

function rel(
  id: string,
  type: 'parent-child' | 'spouse',
  from: string,
  to: string
): Relationship {
  return { id, type, fromPersonId: from, toPersonId: to };
}

export function generateSampleData(): FamilyTreeData {
  // ========== ĐỜI 1 (generation 0) — Ông bà tổ ==========
  const duc = makePerson('duc', 'Nguyễn', 'Văn Đức', 'male', 0, {
    birthDate: '1930-03-15',
    deathDate: '2005-11-20',
    occupation: 'Giáo viên',
    hometown: 'Hà Nam',
    notes: 'Người lập gia phả dòng họ Nguyễn. Từng dạy học tại trường làng hơn 30 năm.',
    spouseIds: ['lan'],
    childrenIds: ['hung', 'huong', 'minh', 'lan2'],
  });

  const lan = makePerson('lan', 'Trần', 'Thị Lan', 'female', 0, {
    birthDate: '1935-08-10',
    deathDate: '2012-04-05',
    occupation: 'Nội trợ',
    hometown: 'Hà Nam',
    notes: 'Nổi tiếng nấu ăn ngon trong làng.',
    spouseIds: ['duc'],
    childrenIds: ['hung', 'huong', 'minh', 'lan2'],
  });

  // ========== ĐỜI 2 (generation 1) — 4 con + 4 vợ/chồng ==========
  const hung = makePerson('hung', 'Nguyễn', 'Văn Hùng', 'male', 1, {
    birthDate: '1955-01-20',
    occupation: 'Kỹ sư cơ khí',
    hometown: 'Hà Nội',
    notes: 'Con trưởng. Chuyển ra Hà Nội làm việc từ 1978.',
    fatherId: 'duc',
    motherId: 'lan',
    spouseIds: ['hoa'],
    childrenIds: ['thanh', 'dung', 'tu'],
  });

  const hoa = makePerson('hoa', 'Lê', 'Thị Hoa', 'female', 1, {
    birthDate: '1958-06-12',
    occupation: 'Kế toán',
    hometown: 'Hà Nội',
    spouseIds: ['hung'],
    childrenIds: ['thanh', 'dung', 'tu'],
  });

  const huong = makePerson('huong', 'Nguyễn', 'Thị Hương', 'female', 1, {
    birthDate: '1958-09-03',
    occupation: 'Bác sĩ',
    hometown: 'TP. Hồ Chí Minh',
    notes: 'Bác sĩ nội khoa tại Bệnh viện Chợ Rẫy.',
    fatherId: 'duc',
    motherId: 'lan',
    spouseIds: ['tuan'],
    childrenIds: ['dat', 'linh'],
  });

  const tuan = makePerson('tuan', 'Phạm', 'Văn Tuấn', 'male', 1, {
    birthDate: '1955-12-25',
    deathDate: '2018-07-14',
    occupation: 'Quân nhân',
    hometown: 'TP. Hồ Chí Minh',
    notes: 'Đại tá quân đội, nghỉ hưu năm 2010.',
    spouseIds: ['huong'],
    childrenIds: ['dat', 'linh'],
  });

  const minh2 = makePerson('minh', 'Nguyễn', 'Văn Minh', 'male', 1, {
    birthDate: '1962-04-18',
    occupation: 'Thương nhân',
    hometown: 'Đà Nẵng',
    notes: 'Kinh doanh vật liệu xây dựng tại Đà Nẵng.',
    fatherId: 'duc',
    motherId: 'lan',
    spouseIds: ['nga'],
    childrenIds: ['quang', 'phuong', 'binh'],
  });

  const nga = makePerson('nga', 'Đỗ', 'Thị Nga', 'female', 1, {
    birthDate: '1965-11-30',
    occupation: 'Giáo viên',
    hometown: 'Đà Nẵng',
    notes: 'Giáo viên dạy Toán cấp 2.',
    spouseIds: ['minh'],
    childrenIds: ['quang', 'phuong', 'binh'],
  });

  const lan2 = makePerson('lan2', 'Nguyễn', 'Thị Lan', 'female', 1, {
    birthDate: '1968-02-14',
    occupation: 'Dược sĩ',
    hometown: 'Hải Phòng',
    notes: 'Mở nhà thuốc tại Hải Phòng từ năm 1995.',
    fatherId: 'duc',
    motherId: 'lan',
    spouseIds: ['son'],
    childrenIds: ['nam', 'van'],
  });

  const son = makePerson('son', 'Hoàng', 'Văn Sơn', 'male', 1, {
    birthDate: '1965-07-22',
    occupation: 'Công an',
    hometown: 'Hải Phòng',
    notes: 'Trung tá Công an TP Hải Phòng.',
    spouseIds: ['lan2'],
    childrenIds: ['nam', 'van'],
  });

  // ========== ĐỜI 3 (generation 2) — 10 cháu + vợ/chồng ==========

  // Nhánh Hùng - Hoa
  const thanh = makePerson('thanh', 'Nguyễn', 'Văn Thành', 'male', 2, {
    birthDate: '1982-03-10',
    occupation: 'IT Manager',
    hometown: 'Hà Nội',
    notes: 'Quản lý dự án tại công ty công nghệ.',
    fatherId: 'hung',
    motherId: 'hoa',
    spouseIds: ['phuong_v'],
    childrenIds: ['khoi', 'an'],
  });

  const phuong_v = makePerson('phuong_v', 'Vũ', 'Thị Phương', 'female', 2, {
    birthDate: '1985-05-20',
    occupation: 'Nhân viên ngân hàng',
    hometown: 'Hà Nội',
    spouseIds: ['thanh'],
    childrenIds: ['khoi', 'an'],
  });

  const dungP = makePerson('dung', 'Nguyễn', 'Thị Dung', 'female', 2, {
    birthDate: '1985-08-15',
    occupation: 'Nhà báo',
    hometown: 'Hà Nội',
    notes: 'Phóng viên tại báo Tuổi Trẻ.',
    fatherId: 'hung',
    motherId: 'hoa',
    spouseIds: ['long'],
    childrenIds: ['han'],
  });

  const long = makePerson('long', 'Bùi', 'Văn Long', 'male', 2, {
    birthDate: '1983-10-02',
    occupation: 'Nhiếp ảnh gia',
    hometown: 'Hà Nội',
    spouseIds: ['dung'],
    childrenIds: ['han'],
  });

  const tu = makePerson('tu', 'Nguyễn', 'Văn Tú', 'male', 2, {
    birthDate: '1990-12-01',
    occupation: 'Lập trình viên',
    hometown: 'Hà Nội',
    notes: 'Chưa lập gia đình. Làm full-stack developer.',
    fatherId: 'hung',
    motherId: 'hoa',
  });

  // Nhánh Hương - Tuấn
  const dat = makePerson('dat', 'Phạm', 'Văn Đạt', 'male', 2, {
    birthDate: '1983-07-08',
    occupation: 'Doanh nhân',
    hometown: 'TP. Hồ Chí Minh',
    notes: 'Giám đốc công ty xuất nhập khẩu.',
    fatherId: 'tuan',
    motherId: 'huong',
    spouseIds: ['yen'],
    childrenIds: ['huy', 'tram'],
  });

  const yen = makePerson('yen', 'Ngô', 'Thị Yến', 'female', 2, {
    birthDate: '1986-03-25',
    occupation: 'Thiết kế nội thất',
    hometown: 'TP. Hồ Chí Minh',
    spouseIds: ['dat'],
    childrenIds: ['huy', 'tram'],
  });

  const linhP = makePerson('linh', 'Phạm', 'Thị Linh', 'female', 2, {
    birthDate: '1988-11-18',
    occupation: 'Luật sư',
    hometown: 'TP. Hồ Chí Minh',
    notes: 'Luật sư tại Văn phòng Luật sư Sài Gòn.',
    fatherId: 'tuan',
    motherId: 'huong',
    spouseIds: ['hai'],
    childrenIds: ['minhanh'],
  });

  const hai = makePerson('hai', 'Trịnh', 'Văn Hải', 'male', 2, {
    birthDate: '1985-04-30',
    occupation: 'Kiểm toán viên',
    hometown: 'TP. Hồ Chí Minh',
    spouseIds: ['linh'],
    childrenIds: ['minhanh'],
  });

  // Nhánh Minh - Nga
  const quang = makePerson('quang', 'Nguyễn', 'Văn Quang', 'male', 2, {
    birthDate: '1988-06-14',
    occupation: 'Bác sĩ',
    hometown: 'Đà Nẵng',
    notes: 'Bác sĩ phẫu thuật tại Bệnh viện Đà Nẵng.',
    fatherId: 'minh',
    motherId: 'nga',
    spouseIds: ['thao'],
    childrenIds: ['minhduc'],
  });

  const thao = makePerson('thao', 'Đinh', 'Thị Thảo', 'female', 2, {
    birthDate: '1990-09-22',
    occupation: 'Y tá',
    hometown: 'Đà Nẵng',
    spouseIds: ['quang'],
    childrenIds: ['minhduc'],
  });

  const phuongN = makePerson('phuong', 'Nguyễn', 'Thị Phương', 'female', 2, {
    birthDate: '1990-01-05',
    occupation: 'Giảng viên đại học',
    hometown: 'Đà Nẵng',
    notes: 'Giảng viên Đại học Bách khoa Đà Nẵng.',
    fatherId: 'minh',
    motherId: 'nga',
    spouseIds: ['khoa'],
    childrenIds: ['phuc', 'ngoc_ly'],
  });

  const khoa = makePerson('khoa', 'Lý', 'Văn Khoa', 'male', 2, {
    birthDate: '1988-08-17',
    occupation: 'Kỹ sư xây dựng',
    hometown: 'Đà Nẵng',
    spouseIds: ['phuong'],
    childrenIds: ['phuc', 'ngoc_ly'],
  });

  const binh = makePerson('binh', 'Nguyễn', 'Văn Bình', 'male', 2, {
    birthDate: '1995-05-30',
    occupation: 'Kiến trúc sư',
    hometown: 'Đà Nẵng',
    notes: 'Chưa lập gia đình. Đang làm tại công ty kiến trúc.',
    fatherId: 'minh',
    motherId: 'nga',
  });

  // Nhánh Lan2 - Sơn
  const nam = makePerson('nam', 'Hoàng', 'Văn Nam', 'male', 2, {
    birthDate: '1990-10-10',
    occupation: 'Kỹ sư điện',
    hometown: 'Hải Phòng',
    fatherId: 'son',
    motherId: 'lan2',
    spouseIds: ['ngoc_t'],
    childrenIds: ['bao'],
  });

  const ngoc_t = makePerson('ngoc_t', 'Trương', 'Thị Ngọc', 'female', 2, {
    birthDate: '1993-12-20',
    occupation: 'Giáo viên mầm non',
    hometown: 'Hải Phòng',
    spouseIds: ['nam'],
    childrenIds: ['bao'],
  });

  const van = makePerson('van', 'Hoàng', 'Thị Vân', 'female', 2, {
    birthDate: '1995-04-08',
    occupation: 'Nghệ sĩ piano',
    hometown: 'Hải Phòng',
    notes: 'Chưa lập gia đình. Biểu diễn piano chuyên nghiệp.',
    fatherId: 'son',
    motherId: 'lan2',
  });

  // ========== ĐỜI 4 (generation 3) — 10 chắt ==========

  const khoi = makePerson('khoi', 'Nguyễn', 'Văn Khôi', 'male', 3, {
    birthDate: '2008-09-15',
    occupation: 'Học sinh',
    hometown: 'Hà Nội',
    fatherId: 'thanh',
    motherId: 'phuong_v',
  });

  const an = makePerson('an', 'Nguyễn', 'Thị An', 'female', 3, {
    birthDate: '2012-03-22',
    occupation: 'Học sinh',
    hometown: 'Hà Nội',
    fatherId: 'thanh',
    motherId: 'phuong_v',
  });

  const han = makePerson('han', 'Bùi', 'Gia Hân', 'female', 3, {
    birthDate: '2013-07-01',
    occupation: 'Học sinh',
    hometown: 'Hà Nội',
    fatherId: 'long',
    motherId: 'dung',
  });

  const huy = makePerson('huy', 'Phạm', 'Văn Huy', 'male', 3, {
    birthDate: '2008-02-14',
    occupation: 'Học sinh',
    hometown: 'TP. Hồ Chí Minh',
    fatherId: 'dat',
    motherId: 'yen',
  });

  const tram = makePerson('tram', 'Phạm', 'Thị Trâm', 'female', 3, {
    birthDate: '2012-06-30',
    occupation: 'Học sinh',
    hometown: 'TP. Hồ Chí Minh',
    fatherId: 'dat',
    motherId: 'yen',
  });

  const minhanh = makePerson('minhanh', 'Trịnh', 'Minh Anh', 'female', 3, {
    birthDate: '2015-01-10',
    occupation: 'Học sinh',
    hometown: 'TP. Hồ Chí Minh',
    fatherId: 'hai',
    motherId: 'linh',
  });

  const minhduc = makePerson('minhduc', 'Nguyễn', 'Minh Đức', 'male', 3, {
    birthDate: '2016-11-25',
    occupation: 'Học sinh',
    hometown: 'Đà Nẵng',
    fatherId: 'quang',
    motherId: 'thao',
  });

  const phuc = makePerson('phuc', 'Lý', 'Thiên Phúc', 'male', 3, {
    birthDate: '2013-04-18',
    occupation: 'Học sinh',
    hometown: 'Đà Nẵng',
    fatherId: 'khoa',
    motherId: 'phuong',
  });

  const ngoc_ly = makePerson('ngoc_ly', 'Lý', 'Khánh Ngọc', 'female', 3, {
    birthDate: '2018-08-08',
    hometown: 'Đà Nẵng',
    fatherId: 'khoa',
    motherId: 'phuong',
  });

  const bao = makePerson('bao', 'Hoàng', 'Gia Bảo', 'male', 3, {
    birthDate: '2020-12-12',
    hometown: 'Hải Phòng',
    fatherId: 'nam',
    motherId: 'ngoc_t',
  });

  // ========== Tập hợp tất cả ==========
  const allPeople: Person[] = [
    duc, lan,
    hung, hoa, huong, tuan, minh2, nga, lan2, son,
    thanh, phuong_v, dungP, long, tu,
    dat, yen, linhP, hai,
    quang, thao, phuongN, khoa, binh,
    nam, ngoc_t, van,
    khoi, an, han, huy, tram, minhanh, minhduc, phuc, ngoc_ly, bao,
  ];

  const people: Record<string, Person> = {};
  for (const p of allPeople) {
    people[p.id] = p;
  }

  // ========== Relationships ==========
  let relId = 0;
  const nextRelId = () => `rel_${++relId}`;

  const relationships: Relationship[] = [
    // Spouse relationships
    rel(nextRelId(), 'spouse', 'duc', 'lan'),
    rel(nextRelId(), 'spouse', 'hung', 'hoa'),
    rel(nextRelId(), 'spouse', 'huong', 'tuan'),
    rel(nextRelId(), 'spouse', 'minh', 'nga'),
    rel(nextRelId(), 'spouse', 'lan2', 'son'),
    rel(nextRelId(), 'spouse', 'thanh', 'phuong_v'),
    rel(nextRelId(), 'spouse', 'dung', 'long'),
    rel(nextRelId(), 'spouse', 'dat', 'yen'),
    rel(nextRelId(), 'spouse', 'linh', 'hai'),
    rel(nextRelId(), 'spouse', 'quang', 'thao'),
    rel(nextRelId(), 'spouse', 'phuong', 'khoa'),
    rel(nextRelId(), 'spouse', 'nam', 'ngoc_t'),

    // Parent-child: Đức + Lan → 4 con
    rel(nextRelId(), 'parent-child', 'duc', 'hung'),
    rel(nextRelId(), 'parent-child', 'lan', 'hung'),
    rel(nextRelId(), 'parent-child', 'duc', 'huong'),
    rel(nextRelId(), 'parent-child', 'lan', 'huong'),
    rel(nextRelId(), 'parent-child', 'duc', 'minh'),
    rel(nextRelId(), 'parent-child', 'lan', 'minh'),
    rel(nextRelId(), 'parent-child', 'duc', 'lan2'),
    rel(nextRelId(), 'parent-child', 'lan', 'lan2'),

    // Parent-child: Hùng + Hoa → 3 con
    rel(nextRelId(), 'parent-child', 'hung', 'thanh'),
    rel(nextRelId(), 'parent-child', 'hoa', 'thanh'),
    rel(nextRelId(), 'parent-child', 'hung', 'dung'),
    rel(nextRelId(), 'parent-child', 'hoa', 'dung'),
    rel(nextRelId(), 'parent-child', 'hung', 'tu'),
    rel(nextRelId(), 'parent-child', 'hoa', 'tu'),

    // Parent-child: Hương + Tuấn → 2 con
    rel(nextRelId(), 'parent-child', 'tuan', 'dat'),
    rel(nextRelId(), 'parent-child', 'huong', 'dat'),
    rel(nextRelId(), 'parent-child', 'tuan', 'linh'),
    rel(nextRelId(), 'parent-child', 'huong', 'linh'),

    // Parent-child: Minh + Nga → 3 con
    rel(nextRelId(), 'parent-child', 'minh', 'quang'),
    rel(nextRelId(), 'parent-child', 'nga', 'quang'),
    rel(nextRelId(), 'parent-child', 'minh', 'phuong'),
    rel(nextRelId(), 'parent-child', 'nga', 'phuong'),
    rel(nextRelId(), 'parent-child', 'minh', 'binh'),
    rel(nextRelId(), 'parent-child', 'nga', 'binh'),

    // Parent-child: Lan2 + Sơn → 2 con
    rel(nextRelId(), 'parent-child', 'son', 'nam'),
    rel(nextRelId(), 'parent-child', 'lan2', 'nam'),
    rel(nextRelId(), 'parent-child', 'son', 'van'),
    rel(nextRelId(), 'parent-child', 'lan2', 'van'),

    // Parent-child: Thành + Phương_V → 2 con
    rel(nextRelId(), 'parent-child', 'thanh', 'khoi'),
    rel(nextRelId(), 'parent-child', 'phuong_v', 'khoi'),
    rel(nextRelId(), 'parent-child', 'thanh', 'an'),
    rel(nextRelId(), 'parent-child', 'phuong_v', 'an'),

    // Parent-child: Dung + Long → 1 con
    rel(nextRelId(), 'parent-child', 'long', 'han'),
    rel(nextRelId(), 'parent-child', 'dung', 'han'),

    // Parent-child: Đạt + Yến → 2 con
    rel(nextRelId(), 'parent-child', 'dat', 'huy'),
    rel(nextRelId(), 'parent-child', 'yen', 'huy'),
    rel(nextRelId(), 'parent-child', 'dat', 'tram'),
    rel(nextRelId(), 'parent-child', 'yen', 'tram'),

    // Parent-child: Linh + Hải → 1 con
    rel(nextRelId(), 'parent-child', 'hai', 'minhanh'),
    rel(nextRelId(), 'parent-child', 'linh', 'minhanh'),

    // Parent-child: Quang + Thảo → 1 con
    rel(nextRelId(), 'parent-child', 'quang', 'minhduc'),
    rel(nextRelId(), 'parent-child', 'thao', 'minhduc'),

    // Parent-child: Phương + Khoa → 2 con
    rel(nextRelId(), 'parent-child', 'khoa', 'phuc'),
    rel(nextRelId(), 'parent-child', 'phuong', 'phuc'),
    rel(nextRelId(), 'parent-child', 'khoa', 'ngoc_ly'),
    rel(nextRelId(), 'parent-child', 'phuong', 'ngoc_ly'),

    // Parent-child: Nam + Ngọc → 1 con
    rel(nextRelId(), 'parent-child', 'nam', 'bao'),
    rel(nextRelId(), 'parent-child', 'ngoc_t', 'bao'),
  ];

  return {
    version: 1,
    metadata: {
      treeName: 'Gia phả họ Nguyễn',
      description: 'Dữ liệu mẫu dòng họ Nguyễn — 4 đời, gốc Hà Nam',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rootPersonId: 'duc',
    },
    people,
    relationships,
  };
}
