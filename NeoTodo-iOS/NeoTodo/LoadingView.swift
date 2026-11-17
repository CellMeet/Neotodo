import UIKit

/// The paper palette the workspace uses before the page paints its own theme.
enum Palette {
    static let paper = UIColor(red: 247 / 255, green: 239 / 255, blue: 227 / 255, alpha: 1)
    static let ink = UIColor(red: 45 / 255, green: 41 / 255, blue: 34 / 255, alpha: 1)
    static let muted = UIColor(red: 136 / 255, green: 125 / 255, blue: 108 / 255, alpha: 1)
    static let error = UIColor(red: 182 / 255, green: 92 / 255, blue: 80 / 255, alpha: 1)
}

/// The first screen: brand, spinner and, if startup fails, the reason.
final class LoadingView: UIView {
    private let mark = UIImageView()
    private let titleLabel = UILabel()
    private let subtitleLabel = UILabel()
    private let spinner = UIActivityIndicatorView(style: .medium)
    private let detailLabel = UILabel()

    override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = Palette.paper
        build()
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) is not used")
    }

    private func build() {
        mark.image = UIImage(named: "AppMark")
        mark.contentMode = .scaleAspectFit
        mark.layer.cornerRadius = 20
        mark.layer.cornerCurve = .continuous
        mark.clipsToBounds = true

        titleLabel.text = "NeoTodo"
        titleLabel.textColor = Palette.ink
        titleLabel.font = .systemFont(ofSize: 34, weight: .bold)
        titleLabel.textAlignment = .center

        subtitleLabel.text = "Laying out the desk"
        subtitleLabel.textColor = Palette.muted
        subtitleLabel.font = .systemFont(ofSize: 12, weight: .regular)
        subtitleLabel.textAlignment = .center

        spinner.color = Palette.muted
        spinner.startAnimating()

        detailLabel.textColor = Palette.error
        detailLabel.font = .systemFont(ofSize: 11, weight: .regular)
        detailLabel.textAlignment = .center
        detailLabel.numberOfLines = 0
        detailLabel.isHidden = true

        let stack = UIStackView(arrangedSubviews: [mark, titleLabel, subtitleLabel, spinner, detailLabel])
        stack.axis = .vertical
        stack.alignment = .center
        stack.spacing = 10
        stack.setCustomSpacing(22, after: mark)
        stack.setCustomSpacing(26, after: subtitleLabel)
        stack.setCustomSpacing(18, after: spinner)
        stack.translatesAutoresizingMaskIntoConstraints = false
        addSubview(stack)

        NSLayoutConstraint.activate([
            stack.centerXAnchor.constraint(equalTo: centerXAnchor),
            stack.centerYAnchor.constraint(equalTo: centerYAnchor, constant: -24),
            stack.leadingAnchor.constraint(greaterThanOrEqualTo: leadingAnchor, constant: 32),
            stack.trailingAnchor.constraint(lessThanOrEqualTo: trailingAnchor, constant: -32),
            mark.widthAnchor.constraint(equalToConstant: 96),
            mark.heightAnchor.constraint(equalToConstant: 96),
        ])
    }

    func showFailure(_ message: String) {
        spinner.stopAnimating()
        spinner.isHidden = true
        subtitleLabel.text = "The workspace did not start"
        detailLabel.text = message
        detailLabel.isHidden = false
    }
}
